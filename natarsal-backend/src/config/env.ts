import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

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
  CORS_ORIGIN: z.string().default("*"),
  BCRYPT_SALT_ROUNDS: z.string().transform(Number).default("12"),
  JWT_EXPIRY: z.string().default("1d"),
  REFRESH_EXPIRY: z.string().default("7d"),
  BASE_URL: z.string().url().optional().default("http://localhost:3001"),
  RENDER_EXTERNAL_URL: z.string().url().optional(),
  VERCEL_URL: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;
export const config = envSchema.parse(process.env);

export const getBaseUrl = (): string => {
  if (config.NODE_ENV === "production") {
    if (process.env.RENDER_EXTERNAL_URL) {
      return process.env.RENDER_EXTERNAL_URL;
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
  }
  return config.BASE_URL || "http://localhost:3001";
};
