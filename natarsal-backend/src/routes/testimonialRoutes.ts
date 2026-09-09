import { Router } from "express";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController";
import { authenticate, isAdmin } from "../middleware/auth.middleware";

const router = Router();

// ✅ Public - Get all testimonials (no auth required)
router.get("/", getTestimonials);

// ✅ Admin only - CRUD operations
// ✅ FIX: Path harus / (karena prefix /admin sudah di app.ts)
router.post("/", authenticate, isAdmin, createTestimonial);
router.put("/:id", authenticate, isAdmin, updateTestimonial);
router.delete("/:id", authenticate, isAdmin, deleteTestimonial);

export default router;
