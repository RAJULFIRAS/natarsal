// D:/natarsal/natarsal-backend/src/routes/reservationRoutes.ts
import { Router } from "express";
import {
  createReservation,
  getReservations,
  getReservationById,
  updateReservationStatus,
  cancelReservation,
} from "../controllers/reservationController";
import { authenticate, isAdmin } from "../middleware/auth.middleware";

const router = Router();

// ============================================================
// PUBLIC ROUTES (No Auth)
// ============================================================
// Create reservation - anyone can create
router.post("/", createReservation);

// ============================================================
// ADMIN ROUTES (Require Auth + Admin)
// ============================================================
// Get all reservations (with pagination, filters)
router.get("/", authenticate, isAdmin, getReservations);

// Get reservation by ID
router.get("/:id", authenticate, isAdmin, getReservationById);

// Update reservation status
router.patch("/:id/status", authenticate, isAdmin, updateReservationStatus);

// Cancel reservation
router.delete("/:id/cancel", authenticate, isAdmin, cancelReservation);

export default router;
