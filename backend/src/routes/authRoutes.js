const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authCtrl = require("../controllers/authController");
const { auth } = require("../middleware/auth");

router.post(
  "/register",
  [body("email").isEmail(), body("password").isLength({ min: 4 }), body("nombre").notEmpty()],
  authCtrl.register
);
router.post("/login", authCtrl.login);
router.get("/me", auth, authCtrl.me);

module.exports = router;