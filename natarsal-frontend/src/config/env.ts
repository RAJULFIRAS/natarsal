import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "staging", "production"])
    .default("development"),
  MODE: z.enum(["development", "test", "production"]).default("development"),
  API_BASE_URL: z.string().url().default("http://localhost:3000/api"),
  VITE_API_BASE_URL: z.string().url().default("http://localhost:3000/api"),
  ENABLE_RESERVATION: z
    .string()
    .transform((val) => val === "true" || val === "1")
    .default("false"),
  VITE_ENABLE_RESERVATION: z
    .string()
    .transform((val) => val === "true" || val === "1")
    .default("false"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  VITE_LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().min(32).optional(),
  CORS_ORIGIN: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

function getEnvVar(key: string, fallback: string): string {
  return import.meta.env[key] || fallback;
}

const PRODUCTION_API_URL = "https://natarsal-backend.vercel.app/api";
const PRODUCTION_FRONTEND_URL = "https://natarsal.vercel.app";

export const config = (() => {
  try {
    const isProduction = import.meta.env.MODE === "production";

    const env = {
      NODE_ENV: import.meta.env.MODE || "development",
      MODE: import.meta.env.MODE || "development",
      API_BASE_URL: getEnvVar(
        "VITE_API_BASE_URL",
        isProduction ? PRODUCTION_API_URL : "http://localhost:3000/api",
      ),
      VITE_API_BASE_URL: getEnvVar(
        "VITE_API_BASE_URL",
        isProduction ? PRODUCTION_API_URL : "http://localhost:3000/api",
      ),
      ENABLE_RESERVATION: getEnvVar("VITE_ENABLE_RESERVATION", "false"),
      VITE_ENABLE_RESERVATION: getEnvVar("VITE_ENABLE_RESERVATION", "false"),
      LOG_LEVEL: getEnvVar("VITE_LOG_LEVEL", isProduction ? "error" : "info"),
      VITE_LOG_LEVEL: getEnvVar(
        "VITE_LOG_LEVEL",
        isProduction ? "error" : "info",
      ),
      DATABASE_URL: import.meta.env["VITE_DATABASE_URL"],
      JWT_SECRET: import.meta.env["VITE_JWT_SECRET"],
      CORS_ORIGIN:
        import.meta.env["VITE_CORS_ORIGIN"] || PRODUCTION_FRONTEND_URL,
    };

    return envSchema.parse(env);
  } catch (error) {
    console.error("❌ Invalid environment variables, using defaults");

    const isProduction = import.meta.env.MODE === "production";
    const fallbackApiUrl = isProduction
      ? "https://natarsal-backend.vercel.app/api"
      : "http://localhost:3000/api";

    return {
      NODE_ENV: "development",
      MODE: "development",
      API_BASE_URL: fallbackApiUrl,
      VITE_API_BASE_URL: fallbackApiUrl,
      ENABLE_RESERVATION: false,
      VITE_ENABLE_RESERVATION: false,
      LOG_LEVEL: "info",
      VITE_LOG_LEVEL: "info",
      DATABASE_URL: undefined,
      JWT_SECRET: undefined,
      CORS_ORIGIN: "http://localhost:1000",
    } as EnvConfig;
  }
})();

export function getEnv<T extends keyof EnvConfig>(key: T): EnvConfig[T] {
  return config[key];
}

export const isProduction = config.NODE_ENV === "production";
export const isDevelopment = config.NODE_ENV === "development";
export const isStaging = config.NODE_ENV === "staging";
