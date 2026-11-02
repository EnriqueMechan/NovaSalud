const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const sc = require("../controllers/saleController");

router.get("/", auth, sc.list);
router.post("/", auth, sc.create);
router.get("/:id", auth, sc.get);

module.exports = router;