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

// ✅ Create menu with image upload - PAKAI uploadSingle
router.post("/menu", uploadSingle, createMenu);

// ✅ Update menu with image upload - PAKAI uploadSingle
router.put("/menu/:id", uploadSingle, updateMenu);

// ✅ Delete menu
router.delete("/menu/:id", deleteMenu);

export default router;
