// D:/natarsal/natarsal-backend/src/config/env.ts
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "staging", "production"])
    .default("development"),
  PORT: z.string().transform(Number).default("3000"),
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
});

export type EnvConfig = z.infer<typeof envSchema>;
export const config = envSchema.parse(process.env);
