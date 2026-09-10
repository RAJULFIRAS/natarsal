import { test, expect, Page } from "@playwright/test";

async function openMobileMenuIfNeeded(page: Page) {
  const isMobile = await page.evaluate(() => window.innerWidth < 768);
  if (isMobile) {
    const hamburger = page.getByRole("button", { name: /open menu/i });
    if (await hamburger.isVisible().catch(() => false)) {
      await hamburger.click();
      await page.waitForTimeout(600);
    }
  }
}

test.describe("Homepage", () => {
  test("should load homepage and show hero section", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Natarsal/);

    await expect(page.locator("h1").first()).toBeVisible();

    await expect(page.locator("nav")).toBeVisible();

    await expect(
      page.getByRole("link", { name: /book now|reserve|reservasi/i }).first(),
    ).toBeVisible();
  });

  test("should navigate to menu page", async ({ page }) => {
    await page.goto("/");

    await openMobileMenuIfNeeded(page);

    await page
      .getByRole("link", { name: /^menu$/i })
      .filter({ visible: true })
      .first()
      .click();

    await expect(page).toHaveURL(/\/menu/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("should navigate to reservation page", async ({ page }) => {
    await page.goto("/");

    await openMobileMenuIfNeeded(page);

    await page
      .getByRole("link", { name: /book now|reserve|reservasi/i })
      .filter({ visible: true })
      .first()
      .click();

    await expect(page).toHaveURL(/\/reservation/);
  });
});
