import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app";

describe("Security Tests", () => {
  describe("Authentication & Authorization", () => {
    it("should reject request without token", async () => {
      await request(app).get("/api/reservations").expect(401);
    });

    it("should reject request with invalid token", async () => {
      await request(app)
        .get("/api/reservations")
        .set("Authorization", "Bearer invalid.jwt.token")
        .expect(401);
    });

    it("should reject admin route access without admin role", async () => {
      const userRes = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Regular User",
          email: `regular-${Date.now()}@test.com`,
          password: "Password123!",
        });

      const userToken = userRes.body.data.token;

      await request(app)
        .post("/api/admin/menu")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe("Input Validation", () => {
    it("should reject XSS attempt in reservation", async () => {
      const response = await request(app)
        .post("/api/reservations")
        .send({
          customerName: '<script>alert("XSS")</script>',
          customerEmail: "xss@test.com",
          customerPhone: "08123456789",
          date: new Date(Date.now() + 86400000).toISOString(),
          guests: 2,
        });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should reject SQL injection attempt", async () => {
      const response = await request(app)
        .post("/api/reservations")
        .send({
          customerName: "Robert'); DROP TABLE reservations;--",
          customerEmail: "sql@test.com",
          customerPhone: "08123456789",
          date: new Date(Date.now() + 86400000).toISOString(),
          guests: 2,
        });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should reject invalid email format", async () => {
      const response = await request(app)
        .post("/api/reservations")
        .send({
          customerName: "Test",
          customerEmail: "not-an-email",
          customerPhone: "08123456789",
          date: new Date(Date.now() + 86400000).toISOString(),
          guests: 2,
        });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should reject negative guests", async () => {
      await request(app)
        .post("/api/reservations")
        .send({
          customerName: "Test",
          customerEmail: `neg-${Date.now()}@test.com`,
          customerPhone: "08123456789",
          date: new Date(Date.now() + 86400000).toISOString(),
          guests: -5,
        })
        .expect(400);
    });

    it("should reject guests > 20", async () => {
      await request(app)
        .post("/api/reservations")
        .send({
          customerName: "Test",
          customerEmail: `big-${Date.now()}@test.com`,
          customerPhone: "08123456789",
          date: new Date(Date.now() + 86400000).toISOString(),
          guests: 999,
        })
        .expect(400);
    });
  });

  describe("Error Handling", () => {
    it("should return 404 for non-existent route", async () => {
      const response = await request(app)
        .get("/api/nonexistent-route")
        .expect(404);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toHaveProperty("code", "NOT_FOUND");
    });

    it("should not expose stack trace in production error", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "nonexistent@test.com",
        password: "wrong",
      });

      expect(response.body.error).not.toHaveProperty("stack");
    });
  });

  describe("Security Headers", () => {
    it("should have security headers", async () => {
      const response = await request(app).get("/health");

      expect(response.headers).toHaveProperty("x-content-type-options");
      expect(response.headers["x-content-type-options"]).toBe("nosniff");

      expect(response.headers).toHaveProperty("x-frame-options");
      expect(response.headers["x-frame-options"]).toBe("DENY");

      expect(response.headers).toHaveProperty("strict-transport-security");
    });
  });
});
