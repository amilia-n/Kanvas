import "dotenv/config";

const required = (key, fallback = undefined) => {
  const val = process.env[key] ?? fallback;
  if (val === undefined) throw new Error(`Missing required env: ${key}`);
  return val;
};

export const config = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT || 8888),
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
  JWT_SECRET: required("JWT_SECRET"),
  JWT_EXPIRES: process.env.JWT_EXPIRES ?? "7d",
  DATABASE_URL: process.env.DATABASE_URL,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
};

if (!config.DATABASE_URL) {
  const haveDiscrete =
    config.DB_USER && config.DB_PASSWORD && config.DB_HOST && config.DB_PORT && config.DB_NAME;
  if (!haveDiscrete) throw new Error("Provide DATABASE_URL or all DB_* fields.");
}