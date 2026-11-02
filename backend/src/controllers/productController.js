const { Product, Category, Supplier } = require("../models");
const sequelize = require("../config/db");
const { validationResult } = require("express-validator");

exports.list = async (req, res) => {
  try {
    const products = await Product.findAll({ include: [Category, Supplier], order: [["id", "ASC"]] });
    res.json(products);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.get = async (req, res) => {
  try {
    const p = await Product.findByPk(req.params.id, { include: [Category, Supplier] });
    if (!p) return res.status(404).json({ message: "No encontrado" });
    res.json(p);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const p = await Product.create(req.body);
    res.status(201).json(p);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: "No encontrado" });
    await p.update(req.body);
    res.json(p);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: "No encontrado" });
    await p.destroy();
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.lowStock = async (req, res) => {
  try {
    const all = await Product.findAll({ include: [Category, Supplier] });
    res.json(all.filter((p) => p.stock <= p.stockMinimo));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};