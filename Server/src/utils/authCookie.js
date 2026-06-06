const env = require("../config/env");

const isProduction = env.nodeEnv === "production";

const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

const authCookieMaxAge = 7 * 24 * 60 * 60 * 1000;

module.exports = {
  authCookieOptions,
  authCookieMaxAge,
};
