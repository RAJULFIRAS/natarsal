import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const PRODUCTION_BACKEND_URL = "https://natarsal-backend.vercel.app";
const PRODUCTION_FRONTEND_URL = "https://natarsal-frontend.vercel.app";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "staging", "production"])
    .default("development"),
  PORT: z.string().transform(Number).default("3001"),
  DATABASE_URL: z.string().url("DATABASE_URL is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  REFRESH_SECRET: z
    .string()
    .min(32, "REFRESH_SECRET must be at least 32 characters"),
  ADMIN_PASSWORD: z
    .string()
    .min(8, "ADMIN_PASSWORD must be at least 8 characters"),
  CORS_ORIGIN: z.string().optional(),
  BCRYPT_SALT_ROUNDS: z.string().transform(Number).default("12"),
  JWT_EXPIRY: z.string().default("1d"),
  REFRESH_EXPIRY: z.string().default("7d"),
  BASE_URL: z.string().url().optional(),
  RENDER_EXTERNAL_URL: z.string().url().optional(),
  VERCEL_URL: z.string().optional(),

  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  CLOUDINARY_URL: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;
export const config = envSchema.parse(process.env);

export const getBaseUrl = (): string => {
  if (config.BASE_URL) {
    return config.BASE_URL.replace(/\/$/, "");
  }

  if (process.env.RENDER_EXTERNAL_URL) {
    return process.env.RENDER_EXTERNAL_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (config.NODE_ENV === "production") {
    return PRODUCTION_BACKEND_URL;
  }

  return "http://localhost:3001";
};

export const getCorsOrigins = (): string[] => {
  if (config.CORS_ORIGIN) {
    return config.CORS_ORIGIN.split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  if (config.NODE_ENV === "production") {
    const origins = [PRODUCTION_FRONTEND_URL];

    if (process.env.VERCEL_URL) {
      origins.push(`https://${process.env.VERCEL_URL}`);
    }
    if (process.env.VERCEL_BRANCH_URL) {
      origins.push(`https://${process.env.VERCEL_BRANCH_URL}`);
    }
    return origins;
  }

  return [
    "http://localhost:1000",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:1000",
    "http://127.0.0.1:5173",
  ];
};
