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

router.post("/", createReservation);

router.get("/", authenticate, isAdmin, getReservations);

router.get("/:id", authenticate, isAdmin, getReservationById);

router.patch("/:id/status", authenticate, isAdmin, updateReservationStatus);

router.delete("/:id/cancel", authenticate, isAdmin, cancelReservation);

export default router;
