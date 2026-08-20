// D:/natarsal/natarsal-backend/src/controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient, Role } from "@prisma/client";
import { config } from "../config/env";
import { AuthRequest } from "../types";

const prisma = new PrismaClient();

// ============================================================
// REGISTER
// ============================================================
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // ✅ VALIDASI INPUT
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "All fields are required" },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({
        success: false,
        error: { code: "CONFLICT", message: "Email already registered" },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: Role.USER },
      select: { id: true, name: true, email: true, role: true },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign({ id: user.id }, config.REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      data: { user, token, refreshToken },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: error.message },
      timestamp: new Date().toISOString(),
    });
  }
};

// ============================================================
// LOGIN - ✅ FIX: Pastikan email & password diambil dari body
// ============================================================
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // ✅ AMBIL DARI BODY
    const { email, password } = req.body;

    // ✅ VALIDASI
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Email and password are required",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // ✅ FIND USER BY EMAIL
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Invalid credentials" },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Invalid credentials" },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign({ id: user.id }, config.REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
        refreshToken,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: error.message },
      timestamp: new Date().toISOString(),
    });
  }
};

// ============================================================
// REFRESH TOKEN
// ============================================================
export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { refreshToken: refreshTokenStr } = req.body;

    if (!refreshTokenStr) {
      res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "Refresh token required" },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const decoded = jwt.verify(refreshTokenStr, config.REFRESH_SECRET) as {
      id: number;
    };

    const user = await prisma.user.findUnique({
      where: { id: Number(decoded.id) },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Invalid refresh token" },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.json({
      success: true,
      data: { token },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Invalid refresh token" },
      timestamp: new Date().toISOString(),
    });
  }
};

// ============================================================
// GET CURRENT USER
// ============================================================
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Unauthorized" },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(req.user.id) },
      select: { id: true, name: true, email: true, role: true },
    });

    res.json({
      success: true,
      data: user,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: error.message },
      timestamp: new Date().toISOString(),
    });
  }
};
