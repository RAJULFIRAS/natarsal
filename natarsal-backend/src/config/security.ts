import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { getCorsOrigins } from "./env";

const corsOrigins = getCorsOrigins();

console.log("CORS Origins configured:", corsOrigins);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (corsOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (origin.endsWith(".vercel.app")) {
      console.log(`CORS allowed Vercel preview origin: ${origin}`);
      return callback(null, true);
    }

    console.warn(`CORS blocked origin: ${origin}`);
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  exposedHeaders: ["Content-Type", "Authorization"],
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

const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      fontSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "https:"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  frameguard: {
    action: "deny",
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: {
    policy: "strict-origin-when-cross-origin",
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
});

export default {
  helmet: helmetConfig,
  cors: cors(corsOptions),
  rateLimiter,
  authLimiter,
};
