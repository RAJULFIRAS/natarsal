// D:/natarsal/natarsal-backend/src/app.ts
import express from "express";
import { config } from "./config/env";
import { errorHandler } from "./middleware/error-handler.middleware";
import securityConfig from "./config/security";
import adminMenuRoutes from "./routes/adminMenuRoutes";
import authRoutes from "./routes/authRoutes";
import reservationRoutes from "./routes/reservationRoutes";
import menuRoutes from "./routes/menuRoutes";
import path from "path";
import exportRoutes from "./routes/exportRoutes";
import publicRoutes from "./routes/publicRoutes";

const app = express();

// ✅ Security middleware
app.use(securityConfig.securityHeaders);
app.use(securityConfig.helmet);
app.use(securityConfig.cors);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ✅ JSON parser - HANYA untuk route yang butuh JSON
// Jangan pasang global JSON parser!
// app.use(express.json()); // ❌ HAPUS INI

// ✅ URL encoded parser untuk form data biasa
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Rate limiting
app.use("/api", securityConfig.rateLimiter);
app.use("/api/auth/login", securityConfig.authLimiter);
app.use("/api/auth/register", securityConfig.authLimiter);

// Health check
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
  });
});

app.get("/ping", (_req, res) => {
  res.send("pong");
});

// ✅ API Routes - JSON parser PER ROUTE
app.use("/api/auth", express.json({ limit: "10mb" }), authRoutes);
app.use(
  "/api/reservations",
  express.json({ limit: "10mb" }),
  reservationRoutes,
);
app.use("/api/menu", express.json({ limit: "10mb" }), menuRoutes);
app.use("/api/export", express.json({ limit: "10mb" }), exportRoutes);
app.use("/api/public", express.json({ limit: "10mb" }), publicRoutes);

// ✅ Route UPLOAD - TIDAK PAKAI JSON PARSER (multer handle sendiri)
app.use("/api/admin", adminMenuRoutes);

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 404 handler
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

// Global error handler
app.use(errorHandler);

export default app;
