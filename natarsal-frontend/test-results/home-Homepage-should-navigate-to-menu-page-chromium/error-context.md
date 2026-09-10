# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home.spec.ts >> Homepage >> should navigate to menu page
- Location: natarsal-frontend\tests\e2e\home.spec.ts:37:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('h1') with timeout 5000ms
  - waiting for locator('h1')

```

```yaml
- navigation "Main navigation":
  - link "Natarsal Logo NATARSAL":
    - /url: /
    - img "Natarsal Logo"
    - text: NATARSAL
  - link "Home":
    - /url: /
  - link "Menu":
    - /url: /menu
  - link "About Us":
    - /url: /about
  - link "Reservation":
    - /url: /reservation
  - link "Contact":
    - /url: /contact
  - button "Select language":
    - img
    - text: EN
  - link "Book Now":
    - /url: /reservation
- main:
  - img
  - paragraph: Loading menu...
- contentinfo:
  - link "Natarsal Logo NATARSAL":
    - /url: /
    - img "Natarsal Logo"
    - text: NATARSAL
  - paragraph: Bringing authentic Nusantara flavors with a modern touch. Enjoy an unforgettable culinary experience at Natarsal.
  - link "Instagram":
    - /url: https://www.instagram.com/natarsal_restaurant
    - img
  - link "Facebook":
    - /url: https://www.facebook.com/natarsal_restaurant
    - img
  - link "Twitter":
    - /url: https://twitter.com/natarsal_restaurant
    - img
  - link "YouTube":
    - /url: https://www.youtube.com/@natarsal_restaurant
    - img
  - heading "Contact Us" [level=4]
  - list:
    - listitem:
      - img
      - text: Denpasar, Bali
    - listitem:
      - img
      - text: +6252 7717 3823
    - listitem:
      - img
      - text: info@natarsal.com
  - heading "Opening Hours" [level=4]
  - list:
    - listitem: Monday - Thursday 11:00 - 22:00
    - listitem: Friday - Saturday 11:00 - 23:00
    - listitem: Sunday 11:00 - 21:00
    - listitem: "*Kitchen closes 1 hour before closing time"
  - img "Sertifikasi Halal"
  - paragraph: © 2026 Natarsal Restaurant. All rights reserved.
```

# Test source

```ts
  1  | import { test, expect, Page } from "@playwright/test";
  2  | 
  3  | /**
  4  |  * Helper: buka mobile menu jika viewport < 768px.
  5  |  * Navbar mobile menggunakan tombol hamburger dengan aria-label "Open menu".
  6  |  */
  7  | async function openMobileMenuIfNeeded(page: Page) {
  8  |   const isMobile = await page.evaluate(() => window.innerWidth < 768);
  9  |   if (isMobile) {
  10 |     const hamburger = page.getByRole("button", { name: /open menu/i });
  11 |     if (await hamburger.isVisible().catch(() => false)) {
  12 |       await hamburger.click();
  13 |       // Tunggu animasi menu (translate-x-full → translate-x-0) selesai
  14 |       await page.waitForTimeout(600);
  15 |     }
  16 |   }
  17 | }
  18 | 
  19 | test.describe("Homepage", () => {
  20 |   test("should load homepage and show hero section", async ({ page }) => {
  21 |     await page.goto("/");
  22 | 
  23 |     await expect(page).toHaveTitle(/Natarsal/);
  24 | 
  25 |     // Hero section harus visible
  26 |     await expect(page.locator("h1").first()).toBeVisible();
  27 | 
  28 |     // Navbar harus visible
  29 |     await expect(page.locator("nav")).toBeVisible();
  30 | 
  31 |     // Tombol "Book Now" harus ada (dari navbar atau hero)
  32 |     await expect(
  33 |       page.getByRole("link", { name: /book now|reserve|reservasi/i }).first(),
  34 |     ).toBeVisible();
  35 |   });
  36 | 
  37 |   test("should navigate to menu page", async ({ page }) => {
  38 |     await page.goto("/");
  39 | 
  40 |     // Buka mobile menu jika perlu
  41 |     await openMobileMenuIfNeeded(page);
  42 | 
  43 |     // Klik link "Menu" — navbar punya 2 versi (desktop hidden, mobile hidden),
  44 |     // jadi pakai :visible filter
  45 |     await page
  46 |       .getByRole("link", { name: /^menu$/i })
  47 |       .filter({ visible: true })
  48 |       .first()
  49 |       .click();
  50 | 
  51 |     await expect(page).toHaveURL(/\/menu/);
> 52 |     await expect(page.locator("h1")).toBeVisible();
     |                                      ^ Error: expect(locator).toBeVisible() failed
  53 |   });
  54 | 
  55 |   test("should navigate to reservation page", async ({ page }) => {
  56 |     await page.goto("/");
  57 | 
  58 |     await openMobileMenuIfNeeded(page);
  59 | 
  60 |     await page
  61 |       .getByRole("link", { name: /book now|reserve|reservasi/i })
  62 |       .filter({ visible: true })
  63 |       .first()
  64 |       .click();
  65 | 
  66 |     await expect(page).toHaveURL(/\/reservation/);
  67 |   });
  68 | });
  69 | 
```