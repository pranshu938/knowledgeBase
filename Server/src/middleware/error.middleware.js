// src/middleware/error.middleware.js
function errorMiddleware(err, req, res, next) {
  console.error("Error middleware:", err);

  const status = err.status || 500;
  const message =
    err.message || "Something went wrong. Please try again later.";

  res.status(status).json({
    message,
    // prod me usually stack hide karte hain
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}

module.exports = errorMiddleware;
