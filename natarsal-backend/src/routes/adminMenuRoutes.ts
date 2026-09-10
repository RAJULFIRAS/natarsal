import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/auth.middleware";
import { uploadMenu } from "../middleware/upload.middleware";
import {
  createMenu,
  updateMenu,
  deleteMenu,
} from "../controllers/adminMenuController";

const router = Router();

router.use(authenticate, isAdmin);

router.post("/menu", uploadMenu, createMenu);
router.put("/menu/:id", uploadMenu, updateMenu);

router.delete("/menu/:id", deleteMenu);

export default router;
