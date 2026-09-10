import { Router } from "express";
import {
  getMenus,
  getMenuById,
  getCategories,
} from "../controllers/menuController";

const router = Router();

router.get("/", getMenus);
router.get("/categories", getCategories);
router.get("/:id", getMenuById);

export default router;
