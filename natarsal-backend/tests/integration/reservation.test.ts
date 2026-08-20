import { describe, it, expect, afterAll } from "vitest";
import request from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/config/database";

describe("Reservation API Integration Tests", () => {
  const testReservation = {
    name: "John Doe",
    customerEmail: "john@example.com",
    phone: "08123456789",
    date: new Date(Date.now() + 86400000).toISOString(),
    guests: 4,
  };

  afterAll(async () => {
    await prisma.reservation.deleteMany({
      where: { customerEmail: testReservation.customerEmail },
    });
  });

  describe("POST /api/reservations", () => {
    it("should create a reservation", async () => {
      const response = await request(app)
        .post("/api/reservations")
        .send(testReservation)
        .expect(201);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body.data).toHaveProperty("reservationNumber");
      expect(response.body.data).toHaveProperty("name", testReservation.name);
      expect(response.body.data).toHaveProperty("status", "PENDING");
    });

    it("should return 400 for invalid data", async () => {
      const invalidData = {
        name: "",
        customerEmail: "invalid",
        phone: "",
        date: "",
        guests: 0,
      };

      const response = await request(app)
        .post("/api/reservations")
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });
});
