// D:/natarsal/natarsal-backend/src/controllers/exportController.ts
import { Response } from "express"; // ✅ Hapus Request
import { PrismaClient } from "@prisma/client";
import ExcelJS from "exceljs";
import { AuthRequest } from "../types";

const prisma = new PrismaClient();

// ============================================================
// EXPORT RESERVATIONS TO EXCEL
// ============================================================
export const exportReservations = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { from, to, status } = req.query;

    // Build where clause
    const where: any = {};
    if (from) {
      where.date = { ...where.date, gte: new Date(from as string) };
    }
    if (to) {
      const endDate = new Date(to as string);
      endDate.setDate(endDate.getDate() + 1);
      where.date = { ...where.date, lt: endDate };
    }
    if (status && status !== "all") {
      where.status = status as string;
    }

    const reservations = await prisma.reservation.findMany({
      where,
      orderBy: { date: "desc" },
    });

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Natarsal";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Reservations");

    // Columns
    worksheet.columns = [
      { header: "No", key: "no", width: 8 },
      { header: "Nomor Reservasi", key: "reservationNumber", width: 20 },
      { header: "Nama Pelanggan", key: "customerName", width: 25 },
      { header: "Email", key: "customerEmail", width: 30 },
      { header: "Telepon", key: "customerPhone", width: 18 },
      { header: "Tanggal & Waktu", key: "date", width: 25 },
      { header: "Jumlah Tamu", key: "guests", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Catatan", key: "notes", width: 30 },
      { header: "Dibuat", key: "createdAt", width: 25 },
    ];

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF825E2E" },
    };
    worksheet.getRow(1).font = { color: { argb: "FFFFFFFF" }, bold: true };

    // Add data
    reservations.forEach((reservation, index) => {
      worksheet.addRow({
        no: index + 1,
        reservationNumber: reservation.reservationNumber,
        customerName: reservation.customerName,
        customerEmail: reservation.customerEmail,
        customerPhone: reservation.customerPhone,
        date: new Date(reservation.date).toLocaleString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        guests: reservation.guests,
        status: reservation.status,
        notes: reservation.notes || "-",
        createdAt: new Date(reservation.createdAt).toLocaleString("id-ID"),
      });
    });

    // Add summary row
    const summaryRow = worksheet.addRow({
      no: "",
      reservationNumber: "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      date: "TOTAL",
      guests: reservations.length,
      status: "",
      notes: "",
      createdAt: "",
    });
    summaryRow.font = { bold: true };
    summaryRow.getCell(6).font = { bold: true };

    // Set response
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=reservations-${new Date().toISOString().split("T")[0]}.xlsx`,
    );
    res.send(buffer);
  } catch (error: any) {
    console.error("Export error:", error);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: error.message },
      timestamp: new Date().toISOString(),
    });
  }
};
