const { Supplier } = require("../models");

exports.list = async (req, res) => {
  const s = await Supplier.findAll({ order: [["id", "ASC"]] });
  res.json(s);
};
exports.create = async (req, res) => {
  try {
    const s = await Supplier.create(req.body);
    res.status(201).json(s);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
exports.update = async (req, res) => {
  const s = await Supplier.findByPk(req.params.id);
  if (!s) return res.status(404).json({ message: "No encontrado" });
  await s.update(req.body);
  res.json(s);
};
exports.remove = async (req, res) => {
  const s = await Supplier.findByPk(req.params.id);
  if (!s) return res.status(404).json({ message: "No encontrado" });
  await s.destroy();
  res.status(204).end();
};