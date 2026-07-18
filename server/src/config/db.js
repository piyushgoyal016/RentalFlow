import { PrismaClient } from "../../../generated/prisma/client.js";
import { config } from "./env.js";

const prisma =
  globalThis.__prisma ?? new PrismaClient({
    log: config.isDevelopment ? ["query", "warn", "error"] : ["warn", "error"],
  });

if (config.isDevelopment) {
  globalThis.__prisma = prisma;
}

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ [DB] Connected to PostgreSQL via Prisma.");
  } catch (error) {
    console.error("❌ [DB] Connection failed:", error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
  console.log("🔌 [DB] Prisma disconnected.");
};

export { prisma };
