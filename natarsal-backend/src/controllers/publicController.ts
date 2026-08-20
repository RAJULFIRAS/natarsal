// D:/natarsal/natarsal-backend/src/controllers/publicController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================
// CHECK RESERVATION STATUS (PUBLIC)
// ============================================================
export const checkReservationStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { reservationNumber, email } = req.query;

    if (!reservationNumber || !email) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Reservation number and email are required",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const reservation = await prisma.reservation.findFirst({
      where: {
        reservationNumber: reservationNumber as string,
        customerEmail: (email as string).toLowerCase(),
      },
    });

    if (!reservation) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Reservation not found" },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.json({
      success: true,
      data: {
        reservationNumber: reservation.reservationNumber,
        customerName: reservation.customerName,
        date: reservation.date,
        guests: reservation.guests,
        status: reservation.status,
        notes: reservation.notes,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Check reservation error:", error);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: error.message },
      timestamp: new Date().toISOString(),
    });
  }
};
