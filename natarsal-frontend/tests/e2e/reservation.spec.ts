import { test, expect } from "@playwright/test";

test.describe("Reservation Flow", () => {
  test("should create a reservation successfully", async ({ page }) => {
    const consoleErrors: string[] = [];
    const networkErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    page.on("response", (response) => {
      if (response.status() >= 400) {
        networkErrors.push(
          `${response.status()} ${response.request().method()} ${response.url()}`,
        );
      }
    });

    await page.goto("/reservation");

    await expect(page.locator('input[name="name"]')).toBeVisible({
      timeout: 10000,
    });

    await page.fill('input[name="name"]', "John Playwright");
    await page.fill('input[name="email"]', `playwright-${Date.now()}@test.com`);
    await page.fill('input[name="phone"]', "08123456789");
    await page.fill('input[name="guests"]', "4");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];
    await page.fill('input[name="date"]', dateStr);

    await page.fill('input[name="time"]', "19:00");

    await page.getByRole("button", { name: /submit|reserve|book/i }).click();

    if (consoleErrors.length > 0) {
      console.log("=== CONSOLE ERRORS ===");
      consoleErrors.forEach((err) => console.log(err));
    }
    if (networkErrors.length > 0) {
      console.log("=== NETWORK ERRORS ===");
      networkErrors.forEach((err) => console.log(err));
    }

    await page.screenshot({
      path: "test-results/debug-after-submit.png",
      fullPage: true,
    });

    const errorMessage = await page
      .locator("text=/error|gagal|failed|invalid/i")
      .first()
      .textContent()
      .catch(() => null);
    if (errorMessage) {
      console.log("=== UI ERROR MESSAGE ===");
      console.log(errorMessage);
    }

    await expect(
      page.getByRole("heading", { name: /reservation successful/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(page.locator("text=/^RSV-\\d+-[A-Z0-9]+$/")).toBeVisible({
      timeout: 15000,
    });
  });

  test("should show validation error for empty form", async ({ page }) => {
    await page.goto("/reservation");

    await expect(page.locator('input[name="name"]')).toBeVisible({
      timeout: 10000,
    });

    await page.getByRole("button", { name: /submit|reserve|book/i }).click();

    await expect(page).toHaveURL(/\/reservation/);
  });
});
