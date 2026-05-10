// src/server.js
const env = require("./config/env");
const connectDB = require("./config/db");
const app = require("./app");

async function startServer() {
  await connectDB();

  app.listen(env.port, () => {
    console.log(`🚀 Server running on port ${env.port} in ${env.nodeEnv} mode`);
  });
}

startServer();
