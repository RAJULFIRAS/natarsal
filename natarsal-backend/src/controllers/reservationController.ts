// D:/natarsal/natarsal-backend/src/controllers/reservationController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types";

const prisma = new PrismaClient();

// ============================================================
// CREATE RESERVATION (PUBLIC - No Auth Required)
// ============================================================
export const createReservation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { customerName, customerEmail, customerPhone, date, guests, notes } =
      req.body;

    // Validasi input
    if (!customerName || !customerEmail || !customerPhone || !date || !guests) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message:
            "All fields are required: customerName, customerEmail, customerPhone, date, guests",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (guests < 1 || guests > 20) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Guests must be between 1 and 20",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // ✅ FIX: Generate unique reservation number dengan timestamp + random
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    const reservationNumber = `RSV-${timestamp}-${random}`;

    // ✅ FIX: Pastikan date adalah Date object yang valid
    const reservationDate = new Date(date);
    if (isNaN(reservationDate.getTime())) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid date format",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Create reservation - biarkan Prisma generate id otomatis
    const reservation = await prisma.reservation.create({
      data: {
        reservationNumber,
        customerName,
        customerEmail: customerEmail.toLowerCase(),
        customerPhone,
        date: reservationDate,
        guests: Number(guests),
        notes: notes || null,
        status: "PENDING",
      },
    });

    res.status(201).json({
      success: true,
      data: reservation,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Create reservation error:", error);

    // ✅ Handle unique constraint error
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        error: {
          code: "CONFLICT",
          message:
            "Reservation with this number already exists. Please try again.",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: error.message || "Failed to create reservation",
      },
      timestamp: new Date().toISOString(),
    });
  }
};

// ============================================================
// GET RESERVATIONS (ADMIN ONLY)
// ============================================================
export const getReservations = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Date filter (range)
    if (req.query.date) {
      const startDate = new Date(req.query.date as string);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      where.date = {
        gte: startDate,
        lt: endDate,
      };
    }

    // ✅ FIX: Status filter - hanya terima status yang valid
    if (req.query.status) {
      const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
      const status = (req.query.status as string).toUpperCase();
      if (validStatuses.includes(status)) {
        where.status = status;
      }
      // Jika status tidak valid, abaikan filter
    }

    // Search filter
    if (req.query.search) {
      const search = req.query.search as string;
      where.OR = [
        { customerName: { contains: search, mode: "insensitive" } },
        { customerEmail: { contains: search, mode: "insensitive" } },
        { reservationNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get data
    const [data, total] = await Promise.all([
      prisma.reservation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.reservation.count({ where }),
    ]);

    res.json({
      success: true,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrevious: page > 1,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Get reservations error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: error.message || "Failed to get reservations",
      },
      timestamp: new Date().toISOString(),
    });
  }
};

// ============================================================
// GET RESERVATION BY ID (ADMIN ONLY)
// ============================================================
export const getReservationById = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid reservation ID",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!reservation) {
      res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `Reservation with ID ${id} not found`,
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.json({
      success: true,
      data: reservation,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Get reservation by ID error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: error.message || "Failed to get reservation",
      },
      timestamp: new Date().toISOString(),
    });
  }
};

// ============================================================
// UPDATE RESERVATION STATUS (ADMIN ONLY)
// ============================================================
export const updateReservationStatus = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid reservation ID",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: reservation,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Update reservation status error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: error.message || "Failed to update reservation status",
      },
      timestamp: new Date().toISOString(),
    });
  }
};

// ============================================================
// CANCEL RESERVATION (ADMIN ONLY)
// ============================================================
export const cancelReservation = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid reservation ID",
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status: "CANCELLED" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: reservation,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Cancel reservation error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: error.message || "Failed to cancel reservation",
      },
      timestamp: new Date().toISOString(),
    });
  }
};
