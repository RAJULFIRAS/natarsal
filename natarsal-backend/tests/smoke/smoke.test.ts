import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app";

describe("Smoke Tests", () => {
  it("should respond to health check", async () => {
    const response = await request(app).get("/api/health").expect(200);

    expect(response.body).toHaveProperty("status", "ok");
    expect(response.body).toHaveProperty("timestamp");
  });

  it("should respond to API request", async () => {
    const response = await request(app).get("/api/menu").expect(200);

    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("data");
  });
});
