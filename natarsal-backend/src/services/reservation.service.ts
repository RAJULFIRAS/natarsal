// D:/natarsal/natarsal-backend/src/services/reservation.service.ts
import { PrismaClient } from "@prisma/client";
import { ValidationError } from "../middleware/error-handler.middleware";

const prisma = new PrismaClient();

export class ReservationService {
  async createReservation(data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    date: Date;
    guests: number;
    notes?: string;
  }) {
    if (data.guests < 1 || data.guests > 20) {
      throw new ValidationError("Guests must be between 1 and 20");
    }

    const reservationNumber = `RSV-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    return prisma.reservation.create({
      data: {
        reservationNumber,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        date: data.date,
        guests: data.guests,
        notes: data.notes,
        status: "PENDING",
      },
    });
  }

  async getReservations(params: {
    page: number;
    limit: number;
    date?: string;
  }) {
    const { page, limit, date } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (date) {
      const start = new Date(date);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      where.date = { gte: start, lt: end };
    }

    const [data, total] = await Promise.all([
      prisma.reservation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: "desc" },
      }),
      prisma.reservation.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
