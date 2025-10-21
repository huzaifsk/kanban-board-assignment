// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// POST /auth/register
exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    // Prevent registering new users with admin role
    if (role === 'admin') {
      return res.status(403).json({ 
        msg: "Cannot register as admin. Admin user already exists.",
        field: "role" 
      });
    }

    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ 
        msg: "User already exists",
        field: "username" 
      });
    }

    user = new User({ username, password, role: role || "user" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id, role: user.role } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) {
          console.error("JWT Sign Error:", err);
          return res.status(500).json({ msg: "Error generating token" });
        }
        res.status(201).json({
          token,
          user: { id: user.id, username: user.username, role: user.role },
        });
      }
    );
  } catch (err) {
    console.error("Register Error:", err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: "Username already taken" });
    }
    res.status(500).json({ msg: "Server error during registration" });
  }
};

// POST /auth/login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if user exists
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ 
        msg: "Invalid credentials",
        field: "username" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        msg: "Invalid credentials",
        field: "password" 
      });
    }

    const payload = { user: { id: user.id, role: user.role } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) {
          console.error("JWT Sign Error:", err);
          return res.status(500).json({ msg: "Error generating token" });
        }
        res.json({
          token,
          user: { id: user.id, username: user.username, role: user.role },
        });
      }
    );
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ msg: "Server error during login" });
  }
};
