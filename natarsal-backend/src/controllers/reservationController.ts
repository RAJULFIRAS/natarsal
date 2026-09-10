import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { AuthRequest } from "../types";

const prisma = new PrismaClient();

const createReservationSchema = z.object({
  customerName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .regex(
      /^[a-zA-Z\s'.,-]+$/,
      "Name contains invalid characters. Only letters, spaces, and '.,- are allowed.",
    ),
  customerEmail: z.string().email("Invalid email format"),
  customerPhone: z
    .string()
    .min(9, "Phone number is too short")
    .max(20, "Phone number is too long")
    .regex(/^\+?[0-9\s-]+$/, "Invalid phone number format"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Date must be in YYYY-MM-DD format (e.g., 2026-09-11)",
  }),
  time: z.string().regex(/^\d{2}:\d{2}$/, {
    message: "Time must be in HH:MM format (e.g., 19:00)",
  }),
  guests: z.coerce
    .number()
    .int("Guests must be an integer")
    .min(1, "Guests must be at least 1")
    .max(20, "Guests must not exceed 20"),
  notes: z.string().max(500, "Notes must not exceed 500 characters").optional(),
});

export const createReservation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const validatedData = createReservationSchema.parse(req.body);

    const {
      customerName,
      customerEmail,
      customerPhone,
      date,
      time,
      guests,
      notes,
    } = validatedData;

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    const reservationNumber = `RSV-${timestamp}-${random}`;

    const reservationDate = new Date(`${date}T${time}:00+07:00`);

    if (reservationDate < new Date()) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Reservation date must be in the future",
          details: {
            date: ["Reservation date cannot be in the past"],
          },
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const reservation = await prisma.reservation.create({
      data: {
        reservationNumber,
        customerName,
        customerEmail: customerEmail.toLowerCase(),
        customerPhone,
        date: reservationDate,
        guests,
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

    if (error instanceof z.ZodError) {
      const details = error.errors.reduce(
        (acc, err) => {
          const field = err.path.join(".");
          if (!acc[field]) {
            acc[field] = [];
          }
          acc[field].push(err.message);
          return acc;
        },
        {} as Record<string, string[]>,
      );

      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          details,
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

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

export const getReservations = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (req.query.date) {
      const startDate = new Date(req.query.date as string);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      where.date = {
        gte: startDate,
        lt: endDate,
      };
    }

    if (req.query.status) {
      const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
      const status = (req.query.status as string).toUpperCase();
      if (validStatuses.includes(status)) {
        where.status = status;
      }
    }

    if (req.query.search) {
      const search = req.query.search as string;
      where.OR = [
        { customerName: { contains: search, mode: "insensitive" } },
        { customerEmail: { contains: search, mode: "insensitive" } },
        { reservationNumber: { contains: search, mode: "insensitive" } },
      ];
    }

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
