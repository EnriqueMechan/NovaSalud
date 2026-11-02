const { Sale, SaleItem, Product, User } = require("../models");
const sequelize = require("../config/db");

exports.list = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      include: [{ model: SaleItem, as: "items", include: [Product] }, User],
      order: [["fecha", "DESC"]],
    });
    res.json(sales);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.create = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { cliente, items } = req.body; // items: [{productId, cantidad}]
    if (!items || !items.length) return res.status(400).json({ message: "Items requeridos" });

    let total = 0;
    const sale = await Sale.create({ cliente, UserId: req.userId, total: 0 }, { transaction: t });

    for (const it of items) {
      const product = await Product.findByPk(it.productId, { transaction: t, lock: t.LOCK.UPDATE });
      if (!product) throw new Error("Producto no encontrado");
      if (product.stock < it.cantidad) throw new Error(`Stock insuficiente para ${product.nombre}`);
      const subtotal = Number(product.precio) * it.cantidad;
      total += subtotal;
      await SaleItem.create(
        {
          SaleId: sale.id,
          ProductId: product.id,
          cantidad: it.cantidad,
          precioUnitario: product.precio,
          subtotal,
        },
        { transaction: t }
      );
      await product.update({ stock: product.stock - it.cantidad }, { transaction: t });
    }

    await sale.update({ total }, { transaction: t });
    await t.commit();
    const full = await Sale.findByPk(sale.id, { include: [{ model: SaleItem, as: "items", include: [Product] }] });
    res.status(201).json(full);
  } catch (e) {
    await t.rollback();
    res.status(400).json({ message: e.message });
  }
};

exports.get = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id, {
      include: [{ model: SaleItem, as: "items", include: [Product] }, User],
    });
    if (!sale) return res.status(404).json({ message: "No encontrado" });
    res.json(sale);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};