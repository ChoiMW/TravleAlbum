import { test, expect } from '@playwright/test';

test('Cover template switching and text editing works', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Verify default state (Minimal template is visible)
  // We can look for the text in MinimalEditorial component
  await expect(page.locator('text=TOKYO').first()).toBeVisible();

  // Switch to City Magazine template
  await page.click('button:has-text("시티 매거진")');
  // CityMagazine extracts the first part of the location (Shinjuku) and makes it uppercase
  await expect(page.locator('text=SHINJUKU').first()).toBeVisible();

  // Switch to Soft Diary template
  await page.click('button:has-text("소프트 다이어리")');
  await expect(page.locator('text=Our Memories')).toBeVisible();

  // Test text editing
  await page.click('button:has-text("상세 편집")');
  
  // Wait for the edit panel to appear
  await expect(page.locator('h3:has-text("상세 편집")')).toBeVisible();

  
  // Fill the title input
  const titleInput = page.locator('input[value="TOKYO SUMMER DAYS"]');
  await titleInput.fill('SEOUL AUTUMN DAYS');
  
  // Click "완료" (Done) button
  await page.click('button:has-text("완료")');
  
  // Verify the new title is visible on the cover
  await expect(page.locator('text=SEOUL').first()).toBeVisible();
});
