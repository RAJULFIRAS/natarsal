import { vi } from "vitest";
import { config } from "dotenv";

config();

process.env.NODE_ENV = "test";

const baseUrl = process.env.DATABASE_URL || "";
const testUrl = baseUrl.replace(/\/natarsal(\?|$)/, "/natarsal_test$1");

if (!testUrl.includes("natarsal_test")) {
  console.warn(
    "DATABASE_URL tidak mengandung 'natarsal'. Pastikan .env sudah benar.",
  );
}

process.env.DATABASE_URL = testUrl;
process.env.JWT_SECRET = "test-jwt-secret-min-32-characters-long!!";
process.env.REFRESH_SECRET = "test-refresh-secret-min-32-characters-long!";
process.env.ADMIN_PASSWORD = "TestAdminPassword123!";
process.env.BASE_URL = "http://localhost:3001";

vi.spyOn(console, "log").mockImplementation(() => {});
vi.spyOn(console, "info").mockImplementation(() => {});
vi.spyOn(console, "debug").mockImplementation(() => {});
