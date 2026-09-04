import { test, expect, devices } from '@playwright/test';

// Define mobile devices
const iPhone13 = devices['iPhone 13'];

test.use({ ...iPhone13 });


test.describe('Hard Debug & Edge Cases', () => {
  test('Mobile viewport layout with extreme inputs (iPhone 13)', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to editing mode
    await page.click('button:has-text("상세 편집")');
    
    // Inject extreme long text to see if it breaks layout
    const longText = "A".repeat(100) + " " + "B".repeat(100);
    const titleInput = page.locator('input[type="text"]').nth(0);
    await titleInput.fill(longText);

    // XSS attempt text
    const xssText = "<script>alert('xss')</script>";
    const locationInput = page.locator('input[type="text"]').nth(1);
    await locationInput.fill(xssText);

    // Emojis and special characters
    const subtitleInput = page.locator('input[type="text"]').nth(3);
    await subtitleInput.fill("👨‍👩‍👧‍👦✈️💥😊!@#$%^&*()");

    await page.click('button:has-text("완료")');

    // Verification
    // React escapes HTML by default, so the exact XSS string should be visible as text
    await expect(page.locator(`text=${xssText}`).first()).toBeVisible();
    await expect(page.locator('text=👨‍👩‍👧‍👦✈️💥😊!@#$%^&*()').first()).toBeVisible();

    // Verify layout hasn't created a horizontal scrollbar on mobile
    const isOverflowing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    // In our app, .app-container is max-width: 480px, overflow-x: hidden.
    // So it should never overflow.
    expect(isOverflowing).toBeFalsy();
  });

  test('Companion toggle functionality', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    await expect(page.locator('text=JINJU & MINSU').first()).toBeVisible();

    await page.click('button:has-text("상세 편집")');
    
    // Uncheck companion toggle
    // The checkbox is sr-only, we can click the label or div
    await page.click('label:has-text("동행자명 표시") + label > div');
    
    await page.click('button:has-text("완료")');

    // The text should not be visible anymore
    await expect(page.locator('text=JINJU & MINSU')).toBeHidden();
  });

});
