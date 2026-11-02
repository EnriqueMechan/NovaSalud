const { Category } = require("../models");

exports.list = async (req, res) => {
  const cats = await Category.findAll({ order: [["id", "ASC"]] });
  res.json(cats);
};
exports.create = async (req, res) => {
  try {
    const c = await Category.create(req.body);
    res.status(201).json(c);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
exports.update = async (req, res) => {
  const c = await Category.findByPk(req.params.id);
  if (!c) return res.status(404).json({ message: "No encontrado" });
  await c.update(req.body);
  res.json(c);
};
exports.remove = async (req, res) => {
  const c = await Category.findByPk(req.params.id);
  if (!c) return res.status(404).json({ message: "No encontrado" });
  await c.destroy();
  res.status(204).end();
};