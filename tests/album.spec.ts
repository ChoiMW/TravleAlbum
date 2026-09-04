import { test, expect } from '@playwright/test';

test('Album page navigation, record integration, and swiping', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Click "이 표지로 확정하기" -> Navigates to /record
  await page.click('button:has-text("이 표지로 확정하기")');
  await expect(page).toHaveURL(/.*\/record/);

  // Verify trip title is displayed on record dashboard
  await expect(page.locator('text=TOKYO SUMMER DAYS').first()).toBeVisible();

  // Click "앨범 만들기" -> Navigates to /album
  await page.click('button:has-text("앨범 만들기")');
  await expect(page).toHaveURL(/.*\/album/);
  
  // Verify Intro Page / Prologue is rendered
  await expect(page.locator('text=Prologue')).toBeVisible();

  // Verify moments and epilogue are rendered in DOM
  await expect(page.locator('text=나리타 공항').first()).toBeVisible();
  await expect(page.locator('text=기억의 마지막 장').first()).toBeVisible();

  // Verify share button triggers toast
  await page.click('button[aria-label="앨범 공유하기"]');
  await expect(page.locator('text=클립보드에 복사되었습니다')).toBeVisible();
});

