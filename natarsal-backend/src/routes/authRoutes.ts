// D:/natarsal/natarsal-backend/src/routes/authRoutes.ts
import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  getMe,
} from "../controllers/authController";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// ============================================================
// PUBLIC ROUTES
// ============================================================
// Register new user
router.post("/register", register);

// Login
router.post("/login", login);

// Refresh token
router.post("/refresh", refreshToken);

// ============================================================
// PROTECTED ROUTES (Require Auth)
// ============================================================
// Get current user info
router.get("/me", authenticate, getMe);

export default router;
