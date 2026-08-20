// D:/natarsal/natarsal-backend/src/config/security.ts
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { securityHeaders } from "../middleware/security-headers.middleware";

// ✅ TAMBAHKAN localhost:1000 ke CORS origin
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:1000", // ✅ TAMBAHKAN INI!
    "http://127.0.0.1:1000",
    "http://127.0.0.1:5173",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
};

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT",
      message: "Too many requests, please try again later.",
    },
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    success: false,
    error: { code: "RATE_LIMIT", message: "Too many login attempts." },
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

export default {
  helmet: helmet(),
  cors: cors(corsOptions),
  rateLimiter,
  authLimiter,
  securityHeaders,
};
