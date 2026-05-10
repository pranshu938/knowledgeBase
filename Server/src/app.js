// src/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const apiRouter = require("./routes");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

// --- Global middlewares ---
app.use(helmet()); // security headers
app.use(compression()); // gzip
app.use(
  cors({
    origin: process.env.CLIENT_URL, // frontend URL
    credentials: true,
  })
);
app.use(express.json()); // parse JSON body
app.use(cookieParser()); // parse cookies
app.use(morgan("dev")); // log requests
// --- API routes ---
app.use("/api", apiRouter);

// --- 404 handler ---
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// --- Central error handler ---
app.use(errorMiddleware);

module.exports = app;
