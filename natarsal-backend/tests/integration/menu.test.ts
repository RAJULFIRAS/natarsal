import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app";

describe("Menu API Integration Tests", () => {
  describe("GET /api/menu", () => {
    it("should return menu list", async () => {
      const response = await request(app).get("/api/menu").expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe("GET /api/menu/categories", () => {
    it("should return categories", async () => {
      const response = await request(app)
        .get("/api/menu/categories")
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
