// D:/natarsal/natarsal-backend/src/middleware/rate-limit.middleware.ts
import rateLimit from "express-rate-limit";

// ============================================================
// GENERAL RATE LIMIT: 100 requests per 15 minutes
// ============================================================
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT",
      message: "Too many requests, please try again later.",
      retryAfter: 15,
    },
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================================
// STRICT RATE LIMIT: 5 requests per minute (for auth)
// ============================================================
export const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT",
      message: "Too many login attempts, please try again later.",
      retryAfter: 60,
    },
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});
