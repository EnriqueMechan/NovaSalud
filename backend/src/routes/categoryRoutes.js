const express = require("express");
const router = express.Router();
const { auth, onlyAdmin } = require("../middleware/auth");
const c = require("../controllers/categoryController");

router.get("/", auth, c.list);
router.post("/", auth, onlyAdmin, c.create);
router.put("/:id", auth, onlyAdmin, c.update);
router.delete("/:id", auth, onlyAdmin, c.remove);

module.exports = router;