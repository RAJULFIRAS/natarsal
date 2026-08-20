// D:/natarsal/natarsal-backend/src/routes/exportRoutes.ts
import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/auth.middleware";
import { exportReservations } from "../controllers/exportController";

const router = Router();

router.get("/reservations/export", authenticate, isAdmin, exportReservations);

export default router;
