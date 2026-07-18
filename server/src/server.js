import { config } from "./config/env.js";
import { connectDB, disconnectDB } from "./config/db.js";
import app from "./app.js";

const startServer = async () => {
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`🚀 [SERVER] Running on port ${config.port} | ENV: ${config.nodeEnv}`);
  });

  // Graceful shutdown — closes DB connections before the process exits
  const shutdown = async (signal) => {
    console.log(`\n⚠️  [SERVER] ${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDB();
      console.log("✅ [SERVER] Shutdown complete.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Catch unhandled promise rejections (async bugs that weren't caught)
  process.on("unhandledRejection", (reason) => {
    console.error("❌ [SERVER] Unhandled Rejection:", reason);
    shutdown("unhandledRejection");
  });
};

startServer();
