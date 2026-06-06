// src/routes/index.js
const express = require("express");
const authRoutes = require("./auth.routes");
const noteRoutes = require("./notes.routes");
const authMiddleWare = require("../middleware/auth.middleware");
const { authCookieOptions } = require("../utils/authCookie");

const router = express.Router();

// healthcheck (useful in prod & monitoring)
router.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// /api/auth/...
router.use("/auth", authRoutes);
router.get("/me", authMiddleWare, (req, res) => {
  res.set("Cache-Control", "no-store");
  res.status(200).json({ status: "verified" });
});
router.post("/logout", authMiddleWare, (req, res) => {
  res.clearCookie("access_token", authCookieOptions);
  res.status(200).json({
    message: "success",
  });
});

// future:
router.use("/notes", noteRoutes);

module.exports = router;
