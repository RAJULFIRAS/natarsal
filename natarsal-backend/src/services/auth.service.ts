// D:/natarsal/natarsal-backend/src/services/auth.service.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient, Role } from "@prisma/client";
import { config } from "../config/env";
import {
  UnauthorizedError,
  ConflictError,
} from "../middleware/error-handler.middleware";

const prisma = new PrismaClient();

export interface AuthResponse {
  user: { id: number; name: string; email: string; role: Role };
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictError("Email already registered");

    const hashed = await bcrypt.hash(password, config.BCRYPT_SALT_ROUNDS || 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: Role.USER,
      },
    });

    // ✅ FIX: user.id sudah number, langsung pakai
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ id: user.id }, config.REFRESH_SECRET, {
      expiresIn: "7d",
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedError("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedError("Invalid credentials");

    // ✅ FIX: user.id sudah number
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ id: user.id }, config.REFRESH_SECRET, {
      expiresIn: "7d",
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    try {
      // ✅ FIX: decoded.id dari JWT adalah number
      const decoded = jwt.verify(token, config.REFRESH_SECRET) as {
        id: number;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.id }, // ← decoded.id sudah number!
      });

      if (!user) throw new UnauthorizedError("User not found");

      const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        config.JWT_SECRET,
        { expiresIn: "15m" },
      );

      return { accessToken };
    } catch {
      throw new UnauthorizedError("Invalid refresh token");
    }
  }

  async logout(_userId: number): Promise<void> {
    return;
  }
}
