import { Router } from "express";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController";
import { authenticate, isAdmin } from "../middleware/auth.middleware";
import { uploadTestimonial } from "../middleware/upload.middleware";

const router = Router();

router.get("/", getTestimonials);

router.post("/", authenticate, isAdmin, uploadTestimonial, createTestimonial);
router.put("/:id", authenticate, isAdmin, uploadTestimonial, updateTestimonial);
router.delete("/:id", authenticate, isAdmin, deleteTestimonial);

export default router;
