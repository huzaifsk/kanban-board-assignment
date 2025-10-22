// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controllers");
const { validateRegister, validateLogin } = require("../middleware/validation.middleware");
const { authLimiter } = require("../middleware/rateLimiter.middleware");

router.post("/register", validateRegister, authController.register);
router.post("/login", authLimiter, validateLogin, authController.login);

module.exports = router;
