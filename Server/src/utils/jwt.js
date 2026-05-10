const jwt = require("jsonwebtoken");
const env = require("../config/env");

// Token banane ka helper
function signToken(userId) {
  return jwt.sign(
    { userId }, // payload
    env.jwtSecret, // secret from .env
    { expiresIn: env.jwtExpiresIn } // e.g. "7d"
  );
}

module.exports = {
  signToken,
};
