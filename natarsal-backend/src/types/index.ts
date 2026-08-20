// D:/natarsal/natarsal-backend/src/types/index.ts
import { Request } from "express";
import { Role } from "@prisma/client";

export interface AuthUser {
  id: number;
  email: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}
