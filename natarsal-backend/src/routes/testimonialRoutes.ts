import { Router } from "express";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController";
import { authenticate, isAdmin } from "../middleware/auth.middleware";

const router = Router();

// Public - Get all testimonials (no auth required)
router.get("/", getTestimonials);

// Admin only - CRUD operations
router.post("/admin/testimonials", authenticate, isAdmin, createTestimonial);
router.put("/admin/testimonials/:id", authenticate, isAdmin, updateTestimonial);
router.delete(
  "/admin/testimonials/:id",
  authenticate,
  isAdmin,
  deleteTestimonial,
);

export default router;
