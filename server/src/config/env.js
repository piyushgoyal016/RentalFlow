import "dotenv/config";

const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "PORT",
  "NODE_ENV",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "JWT_ACCESS_EXPIRES_IN",
  "JWT_REFRESH_EXPIRES_IN",
  "BCRYPT_SALT_ROUNDS",
  "CORS_ORIGIN",
];

const missingVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  console.error("❌ [CONFIG] Missing environment variables:");
  missingVars.forEach((key) => console.error(`   → ${key}`));
  process.exit(1);
}

export const config = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
  databaseUrl: process.env.DATABASE_URL,

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },

  bcrypt: {
    saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS),
  },

  cors: {
    origin: process.env.CORS_ORIGIN,
  },
};

if (config.isDevelopment) {
  console.log(`✅ [CONFIG] Loaded | PORT: ${config.port} | ENV: ${config.nodeEnv}`);
}
