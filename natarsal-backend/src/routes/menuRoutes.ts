// D:/natarsal/natarsal-backend/src/routes/menuRoutes.ts
import { Router } from "express";
import {
  getMenus,
  getMenuById,
  getCategories,
} from "../controllers/menuController";

const router = Router();

// Public routes (no auth required)
router.get("/", getMenus);
router.get("/categories", getCategories);
router.get("/:id", getMenuById);

export default router;
