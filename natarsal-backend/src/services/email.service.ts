// D:/natarsal/natarsal-backend/src/services/email.service.ts
import nodemailer from "nodemailer";
// ✅ Hapus import config

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(data: EmailData): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || "noreply@natarsal.com",
        to: data.to,
        subject: data.subject,
        html: data.html,
      });
      console.log(`✅ Email sent to ${data.to}`);
    } catch (error) {
      console.error("❌ Email send failed:", error);
      throw error;
    }
  }

  async sendReservationConfirmation(data: {
    to: string;
    customerName: string;
    reservationNumber: string;
    date: string;
    guests: number;
  }): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #825E2E; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f5f0eb; padding: 30px; border-radius: 0 0 8px 8px; }
          .detail { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #825E2E; }
          .label { font-weight: bold; color: #825E2E; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #825E2E; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✨ Natarsal Restaurant</h1>
          <p>Reservation Confirmation</p>
        </div>
        <div class="content">
          <h2>Halo ${data.customerName},</h2>
          <p>Terima kasih telah melakukan reservasi di <strong>Natarsal Restaurant</strong>.</p>
          <p>Berikut detail reservasi Anda:</p>
          
          <div class="detail">
            <p><span class="label">Nomor Reservasi:</span> <strong>${data.reservationNumber}</strong></p>
            <p><span class="label">Tanggal & Waktu:</span> ${new Date(data.date).toLocaleString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
            <p><span class="label">Jumlah Tamu:</span> ${data.guests} orang</p>
          </div>

          <p style="margin-top: 20px;">Status reservasi Anda saat ini: <strong style="color: #f59e0b;">PENDING</strong></p>
          <p>Kami akan mengkonfirmasi reservasi Anda segera.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:1000/reservation" class="button">Lihat Reservasi</a>
          </div>

          <p style="font-size: 14px; color: #666;">
            Jika ada perubahan, silakan hubungi kami di <strong>+6252 7717 3823</strong>
          </p>
        </div>
        <div class="footer">
          <p>&copy; 2026 Natarsal Restaurant. All rights reserved.</p>
          <p>Denpasar, Bali</p>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: data.to,
      subject: `✨ Reservation Confirmed - ${data.reservationNumber}`,
      html,
    });
  }

  async sendStatusUpdateEmail(data: {
    to: string;
    customerName: string;
    reservationNumber: string;
    status: string;
  }): Promise<void> {
    const statusMap: Record<
      string,
      { label: string; color: string; message: string }
    > = {
      CONFIRMED: {
        label: "Terkonfirmasi ✅",
        color: "#10b981",
        message:
          "Reservasi Anda telah dikonfirmasi! Kami tunggu kedatangan Anda.",
      },
      CANCELLED: {
        label: "Dibatalkan ❌",
        color: "#ef4444",
        message:
          "Reservasi Anda telah dibatalkan. Jika ini kesalahan, silakan hubungi kami.",
      },
      COMPLETED: {
        label: "Selesai ✅",
        color: "#3b82f6",
        message:
          "Terima kasih telah berkunjung ke Natarsal! Kami harap Anda menikmati hidangan kami.",
      },
    };

    const statusInfo = statusMap[data.status] || statusMap.CONFIRMED;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #825E2E; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f5f0eb; padding: 30px; border-radius: 0 0 8px 8px; }
          .status-badge { display: inline-block; background: ${statusInfo.color}; color: white; padding: 8px 20px; border-radius: 20px; font-weight: bold; }
          .detail { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✨ Natarsal Restaurant</h1>
          <p>Status Reservasi Diperbarui</p>
        </div>
        <div class="content">
          <h2>Halo ${data.customerName},</h2>
          <p>Status reservasi Anda telah diperbarui:</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <span class="status-badge">${statusInfo.label}</span>
          </div>

          <div class="detail">
            <p><strong>Nomor Reservasi:</strong> ${data.reservationNumber}</p>
            <p><strong>Status:</strong> ${statusInfo.label}</p>
          </div>

          <p>${statusInfo.message}</p>

          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            Jika ada pertanyaan, hubungi kami di <strong>+6252 7717 3823</strong>
          </p>
        </div>
        <div class="footer">
          <p>&copy; 2026 Natarsal Restaurant. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to: data.to,
      subject: `📋 Reservation ${data.status} - ${data.reservationNumber}`,
      html,
    });
  }
}

export const emailService = new EmailService();
