import { PrismaClient } from "@prisma/client";
import { config } from "./env.js";

let prisma;

const isPostgres = config.databaseUrl.startsWith("postgres://") ||
                   config.databaseUrl.startsWith("postgresql://");

if (isPostgres) {
  // ─── Remote PostgreSQL via pg pool adapter ────────────────────────────────
  const { PrismaPg }      = await import("@prisma/adapter-pg");
  const { default: pg }   = await import("pg");
  const pool    = new pg.Pool({ connectionString: config.databaseUrl });
  const adapter = new PrismaPg(pool);

  prisma = globalThis.__prisma ?? new PrismaClient({
    adapter,
    log: ["warn", "error"],
  });
} else {
  // ─── Local SQLite via LibSQL adapter ─────────────────────────────────────
  // PrismaLibSql is a FACTORY — pass { url } config directly, not a libsql client
  const { PrismaLibSql } = await import("@prisma/adapter-libsql");
  const adapter = new PrismaLibSql({ url: config.databaseUrl });

  prisma = globalThis.__prisma ?? new PrismaClient({
    adapter,
    log: ["warn", "error"],
  });
}

if (config.isDevelopment) {
  globalThis.__prisma = prisma;
}

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log(`✅ [DB] Connected to ${isPostgres ? "PostgreSQL (remote)" : "SQLite (local)"} via Prisma.`);
  } catch (error) {
    console.error("❌ [DB] Connection failed:", error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
  console.log("🔌 [DB] Disconnected.");
};

export { prisma };
