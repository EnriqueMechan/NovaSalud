/* eslint-disable */
/**
 * Nova Salud - Adaptador de base de datos en memoria (sin dependencias nativas).
 *
 * Reemplaza a Sequelize + SQLite para evitar la compilacion de modulos nativos
 * (sqlite3) que no es posible en entornos sin acceso a headers de Node.js.
 * Expone la misma interfaz que usan los controladores: define, sync, transaction,
 * Op, y los metodos de los modelos (findAll, findByPk, findOne, create, update,
 * destroy, count) con soporte para include, where y order.
 */

const stores = {};

function storeFor(name) {
  if (!stores[name]) {
    stores[name] = { data: [], nextId: 1 };
  }
  return stores[name];
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function matchWhere(row, where) {
  if (!where) return true;
  for (const [key, val] of Object.entries(where)) {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      for (const [op, opVal] of Object.entries(val)) {
        const rowVal = row[key];
        switch (op) {
          case '$gt': case 'gt': if (!(rowVal > opVal)) return false; break;
          case '$gte': case 'gte': if (!(rowVal >= opVal)) return false; break;
          case '$lt': case 'lt': if (!(rowVal < opVal)) return false; break;
          case '$lte': case 'lte': if (!(rowVal <= opVal)) return false; break;
          case '$ne': case 'ne': if (rowVal === opVal) return false; break;
          case '$like': case 'like': {
            const re = new RegExp(String(opVal).replace(/%/g, '.*'), 'i');
            if (!re.test(String(rowVal))) return false;
            break;
          }
          default: if (row[key] !== val) return false;
        }
      }
    } else {
      if (row[key] !== val) return false;
    }
  }
  return true;
}

function applyOrder(rows, order) {
  if (!order || !order.length) return rows;
  const [field, dir = 'ASC'] = order[0];
  return [...rows].sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    let cmp = 0;
    if (av < bv) cmp = -1;
    else if (av > bv) cmp = 1;
    return dir === 'DESC' ? -cmp : cmp;
  });
}

function fkCandidates(parentName, targetName) {
  // Posibles nombres de columna FK que referencian a parentName desde targetName
  return [
    `${parentName}Id`,      // SaleId, CategoryId, UserId, ProductId
    `${parentName.toLowerCase()}Id`, // saleid, categoryid...
    `${targetName.toLowerCase()}Id`,
    `${parentName.toLowerCase()}_id`,
  ];
}

function applyInclude(rows, include, sequelizeRef) {
  if (!include || !include.length) return rows;

  const parentName = sequelizeRef._currentModelName || 'unknown';

  return rows.map((row) => {
    const result = { ...deepClone(row) };

    for (const inc of include) {
      let targetModel;
      let as;

      if (inc.model) {
        targetModel = inc.model;
        as = inc.as || targetModel.name;
      } else {
        // include: [Category, Supplier] - modelo directo sin alias
        targetModel = inc;
        as = targetModel.name;
      }
      if (!targetModel || !targetModel.findAll) continue;

      // Buscar la FK: registros de targetModel donde fk == row.pk
      const targetPk = targetModel.primaryKey || 'id';
      const fkCols = fkCandidates(parentName, targetModel.name);
      let fkCol = null;
      for (const c of fkCols) {
        // Probar si existe en alguna fila del target
        const sample = targetModel.data.find((r) => c in r);
        if (sample) { fkCol = c; break; }
      }
      if (!fkCol) continue;

      const related = targetModel.findAll ? targetModel.findAll({}) : [];
      const items = related.filter((r) => r[fkCol] == row[targetModel.primaryKey || 'id']);

      const isHasMany = targetModel.associations && targetModel.associations.hasMany;
      const resultKey = inc.as || as;
      result[resultKey] = items.length === 1 && !isHasMany ? items[0] : items;

      // Incluir sub-relaciones recursivamente
      if (inc.include && items.length) {
        const list = Array.isArray(items) ? items : [items];
        list.forEach((item) => {
          const enriched = applyInclude([item], inc.include, sequelizeRef);
          if (enriched.length) Object.assign(item, enriched[0]);
        });
      }
    }
    return result;
  });
}

function attachInstanceMethods(model, row) {
  const store = storeFor(model.name);
  const pkField = model.primaryKey || 'id';
  row.update = async function (data) {
    Object.assign(this, data, { updatedAt: new Date().toISOString() });
    const idx = store.data.findIndex((r) => r[pkField] === this[pkField]);
    if (idx !== -1) Object.assign(store.data[idx], this);
    return this;
  };
  row.destroy = async function () {
    const idx = store.data.findIndex((r) => r[pkField] === this[pkField]);
    if (idx !== -1) store.data.splice(idx, 1);
    return this;
  };
  row.toJSON = function () { return deepClone(this); };
  row.get = function (key) { return key === undefined ? deepClone(this) : this[key]; };
  row.set = function (key, val) { this[key] = val; return this; };
  row.setAttributes = function (data) { Object.assign(this, data); return this; };
  row.changed = function () { return false; };
  row.isNewRecord = false;
  return row;
}

function createModel(name, attributes, sequelizeRef) {
  const store = storeFor(name);
  const pkEntry = Object.entries(attributes).find(
    ([, attr]) => attr && attr.primaryKey
  );
  const pkField = pkEntry ? pkEntry[0] : 'id';

  const model = {
    name,
    attributes,
    primaryKey: pkField,
    associations: { hasMany: false, belongsTo: false },
    data: store.data,

    async findAll(options = {}) {
      sequelizeRef._currentModelName = this.name;
      let rows = [...store.data];
      if (options.where) rows = rows.filter((r) => matchWhere(r, options.where));
      rows = applyOrder(rows, options.order);
      if (options.limit) rows = rows.slice(0, options.limit);
      if (options.offset) rows = rows.slice(options.offset);
      if (options.include) rows = applyInclude(rows, options.include, sequelizeRef);
      return rows.map((r) => attachInstanceMethods(this, deepClone(r)));
    },

    async findByPk(id, options = {}) {
      const rows = await this.findAll({
        where: { [pkField]: id },
        include: options.include,
        order: options.order,
      });
      return rows[0] || null;
    },

    async findOne(options = {}) {
      const rows = await this.findAll({ ...options, limit: 1 });
      return rows[0] || null;
    },

    async count(options = {}) {
      let rows = [...store.data];
      if (options.where) rows = rows.filter((r) => matchWhere(r, options.where));
      return rows.length;
    },

    async create(data, options = {}) {
      const id = store.nextId++;
      const now = new Date().toISOString();
      const row = { [pkField]: id, ...data, createdAt: now, updatedAt: now };
      store.data.push(row);
      return attachInstanceMethods(this, deepClone(row));
    },

    async bulkCreate(rows, options = {}) {
      const now = new Date().toISOString();
      const created = rows.map((data) => {
        const id = store.nextId++;
        const row = { [pkField]: id, ...data, createdAt: now, updatedAt: now };
        store.data.push(row);
        return attachInstanceMethods(this, deepClone(row));
      });
      return created;
    },

    async update(data, options = {}) {
      if (options.where) {
        const rows = await this.findAll({ where: options.where });
        rows.forEach((r) => Object.assign(r, data, { updatedAt: new Date().toISOString() }));
        return [rows.length];
      }
      return [0];
    },

    async destroy(options = {}) {
      if (options.where) {
        const rows = await this.findAll({ where: options.where });
        const ids = rows.map((r) => r[pkField]);
        store.data = store.data.filter((r) => !ids.includes(r[pkField]));
        return ids.length;
      }
      return 0;
    },

    async sync() { return this; },
    async destroy() { store.data = []; return this; },

    hasMany() { this.associations.hasMany = true; return this; },
    belongsTo() { this.associations.belongsTo = true; return this; },
    hasOne() { return this; },
    belongsToMany() { return this; },
    addScope() { return this; },
    scope() { return this; },
  };

  return model;
}

const Op = {
  eq: '$eq', ne: '$ne', gte: '$gte', lte: '$lte',
  gt: '$gt', lt: '$lt', like: '$like', notLike: '$notLike',
  in: '$in', notIn: '$notIn', between: '$between',
  and: '$and', or: '$or',
};

const sequelize = {
  models: {},
  _currentModelName: null,
  async sync() { return this; },
  async authenticate() { return this; },
  async transaction() {
    const t = {
      async commit() { return this; },
      async rollback() { return this; },
      LOCK: { UPDATE: 'UPDATE', SHARE: 'SHARE' },
    };
    return t;
  },
  define(name, attributes) {
    const model = createModel(name, attributes, sequelize);
    sequelize.models[name] = model;
    return model;
  },
};

module.exports = sequelize;
module.exports.Sequelize = { Op };
module.exports.Op = Op;
module.exports.DataTypes = {
  INTEGER: 'INTEGER', STRING: 'STRING', TEXT: 'TEXT', BOOLEAN: 'BOOLEAN',
  DECIMAL: 'DECIMAL', DATE: 'DATE', FLOAT: 'FLOAT', UUID: 'UUID', JSON: 'JSON',
};
