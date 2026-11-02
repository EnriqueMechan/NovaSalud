const express = require("express");
const router = express.Router();
const { auth, onlyAdmin } = require("../middleware/auth");
const s = require("../controllers/supplierController");

router.get("/", auth, s.list);
router.post("/", auth, onlyAdmin, s.create);
router.put("/:id", auth, onlyAdmin, s.update);
router.delete("/:id", auth, onlyAdmin, s.remove);

module.exports = router;