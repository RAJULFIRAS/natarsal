import { test, expect, Page } from "@playwright/test";

async function performLogin(page: Page, email: string, password: string) {
  await page.goto("/admin/login");

  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);

  const loginButton = page.getByRole("button", { name: /login/i });
  await loginButton.scrollIntoViewIfNeeded();
  await loginButton.click();
}

test.describe("Admin Authentication", () => {
  test("should show login form", async ({ page }) => {
    await page.goto("/admin/login");

    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    const loginButton = page.getByRole("button", { name: /login/i });
    await loginButton.scrollIntoViewIfNeeded();
    await expect(loginButton).toBeVisible();
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await performLogin(page, "wrong@test.com", "wrongpass");

    await expect(page.locator("text=/invalid|salah|gagal|error/i")).toBeVisible(
      { timeout: 10000 },
    );
  });

  test("should redirect to dashboard on valid login", async ({ page }) => {
    await performLogin(page, "admin@natarsal.com", "god damn admin");

    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15000 });
  });

  test("should logout and redirect to login", async ({ page }) => {
    await performLogin(page, "admin@natarsal.com", "god damn admin");
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15000 });

    const isMobile = await page.evaluate(() => window.innerWidth < 768);

    const logoutButton = isMobile
      ? page.getByTestId("logout-button-header")
      : page.getByTestId("logout-button-sidebar");

    await logoutButton.waitFor({ state: "visible", timeout: 5000 });

    await logoutButton.click();

    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 10000 });
  });
});
