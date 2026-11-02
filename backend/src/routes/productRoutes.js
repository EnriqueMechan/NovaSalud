const express = require("express");
const router = express.Router();
const { auth, onlyAdmin } = require("../middleware/auth");
const pc = require("../controllers/productController");
const { body } = require("express-validator");

router.get("/", auth, pc.list);
router.get("/low-stock", auth, pc.lowStock);
router.get("/:id", auth, pc.get);
router.post(
  "/",
  auth,
  onlyAdmin,
  [body("nombre").notEmpty(), body("precio").isNumeric(), body("stock").isInt()],
  pc.create
);
router.put("/:id", auth, onlyAdmin, pc.update);
router.delete("/:id", auth, onlyAdmin, pc.remove);

module.exports = router;