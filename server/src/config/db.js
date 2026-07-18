import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { config } from "./env.js";

const { Pool } = pg;

const pool = new Pool({
  connectionString: config.databaseUrl,
});

const adapter = new PrismaPg(pool);

const prisma =
  globalThis.__prisma ?? new PrismaClient({
    adapter,
    log: config.isDevelopment ? ["query", "warn", "error"] : ["warn", "error"],
  });

if (config.isDevelopment) {
  globalThis.__prisma = prisma;
}

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ [DB] Connected to PostgreSQL via Prisma (v7 adapter).");
  } catch (error) {
    console.error("❌ [DB] Connection failed:", error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
  await pool.end();
  console.log("🔌 [DB] Prisma and PG Pool disconnected.");
};

export { prisma };
