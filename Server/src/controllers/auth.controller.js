// src/controllers/auth.controller.js
// Abhi sirf placeholder, next step me real logic daalenge
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    // Yahan aane tak Zod ne req.body validate kar diya hoga
    const { name, email, password } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists." });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10); // 10 = salt rounds

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    // Optional: create token on register too
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true in production (HTTPS)
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    // Zod ne already { email, password } validate kiya hai
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true in production (HTTPS)
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
};
