// D:/natarsal/natarsal-backend/src/routes/publicRoutes.ts
import { Router } from "express";
import { checkReservationStatus } from "../controllers/publicController";

const router = Router();

router.get("/reservations/check", checkReservationStatus);

export default router;
