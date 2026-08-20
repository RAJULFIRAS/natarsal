// D:/natarsal/natarsal-backend/src/routes/adminMenuRoutes.ts
import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/auth.middleware";
import { uploadSingle } from "../middleware/upload.middleware";
import {
  createMenu,
  updateMenu,
  deleteMenu,
} from "../controllers/adminMenuController";

const router = Router();

// ✅ Semua routes memerlukan autentikasi admin
router.use(authenticate, isAdmin);

// ✅ Create menu with image upload - TIDAK PAKAI JSON PARSER
router.post("/menu", uploadSingle, createMenu);

// ✅ Update menu with image upload - TIDAK PAKAI JSON PARSER
router.put("/menu/:id", uploadSingle, updateMenu);

// ✅ Delete menu - ini bisa pakai JSON parser (tapi tidak masalah)
router.delete("/menu/:id", deleteMenu);

export default router;
