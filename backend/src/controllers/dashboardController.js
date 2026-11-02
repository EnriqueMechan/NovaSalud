const { Product, Sale, SaleItem } = require("../models");
const { Op } = require("sequelize");

exports.summary = async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const lowStock = (await Product.findAll()).filter((p) => p.stock <= p.stockMinimo).length;
    const sales = await Sale.findAll();
    const totalSales = sales.reduce((a, s) => a + Number(s.total), 0);
    const today = new Date().toISOString().slice(0, 10);
    const todaySales = sales.filter((s) => s.fecha && s.fecha.toISOString().slice(0, 10) === today);
    const todayTotal = todaySales.reduce((a, s) => a + Number(s.total), 0);
    res.json({ totalProducts, lowStock, totalSales, salesCount: sales.length, todaySales: todaySales.length, todayTotal });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};