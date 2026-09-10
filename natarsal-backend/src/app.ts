import express from "express";
import { config } from "./config/env";
import { errorHandler } from "./middleware/error-handler.middleware";
import securityConfig from "./config/security";
import adminMenuRoutes from "./routes/adminMenuRoutes";
import authRoutes from "./routes/authRoutes";
import reservationRoutes from "./routes/reservationRoutes";
import menuRoutes from "./routes/menuRoutes";
import path from "path";
import fs from "fs";
import exportRoutes from "./routes/exportRoutes";
import publicRoutes from "./routes/publicRoutes";
import testimonialRoutes from "./routes/testimonialRoutes";

const app = express();

app.use(securityConfig.helmet);
app.use(securityConfig.cors);

const uploadsPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

console.log(`Serving uploads from: ${uploadsPath}`);

app.use(
  "/uploads",
  (_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(uploadsPath, {
    maxAge: "7d",
    setHeaders: (res, _filePath) => {
      res.setHeader("Cache-Control", "public, max-age=604800");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  }),
);

app.get("/debug/uploads", (_req, res) => {
  try {
    const files = fs.readdirSync(uploadsPath);
    res.json({
      uploadsPath,
      files,
      count: files.length,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api", securityConfig.rateLimiter);
app.use("/api/auth/login", securityConfig.authLimiter);
app.use("/api/auth/register", securityConfig.authLimiter);

const healthHandler = (_req: express.Request, res: express.Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
  });
};

app.get("/health", healthHandler);
app.get("/api/health", healthHandler);

app.get("/ping", (_req, res) => {
  res.send("pong");
});

app.use("/api/auth", express.json({ limit: "10mb" }), authRoutes);
app.use(
  "/api/reservations",
  express.json({ limit: "10mb" }),
  reservationRoutes,
);
app.use("/api/menu", express.json({ limit: "10mb" }), menuRoutes);
app.use("/api/export", express.json({ limit: "10mb" }), exportRoutes);
app.use("/api/public", express.json({ limit: "10mb" }), publicRoutes);
app.use(
  "/api/testimonials",
  express.json({ limit: "10mb" }),
  testimonialRoutes,
);

app.use("/api/admin", adminMenuRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.path} not found`,
    },
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

export default app;
