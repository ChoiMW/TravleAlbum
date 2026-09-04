import { test, expect } from '@playwright/test';
import path from 'path';

test('Persona 1: Jeju Healing Trip - Minimal Editorial with Real Photo Uploads', async ({ page }) => {
  const fixturesDir = path.join(__dirname, 'fixtures', 'images');
  const coverPhoto = path.join(fixturesDir, 'jeju_sunset.jpg');
  const cafePhoto = path.join(fixturesDir, 'jeju_cafe.jpg');
  const oceanPhoto = path.join(fixturesDir, 'jeju_ocean.jpg');

  // 1. Initial Load & Clear
  await page.goto('http://localhost:3000');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // 2. Select Minimal Editorial & Edit Cover
  await page.click('button:has-text("미니멀 에디토리얼")');
  await page.click('button:has-text("상세 편집")');

  await page.locator('input[type="text"]').nth(0).fill('JEJU ISLAND SLOW TRIP');
  await page.locator('input[type="text"]').nth(1).fill('Aewol · Hyeopjae · Hallasan');
  await page.locator('input[type="text"]').nth(2).fill('2026.09.10 — 2026.09.14');
  await page.locator('input[type="text"]').nth(3).fill('바람과 파도, 돌담길을 따라 걷던 나날들');
  await page.click('button:has-text("완료")');

  // 3. Real Cover Photo Upload
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.click('button:has-text("사진 변경")');
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(coverPhoto);

  // Wait for canvas compression to complete and cover image to update
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'test-results/persona_1_cover.png' });

  // 4. Confirm cover and navigate to record
  await page.click('button:has-text("이 표지로 확정하기")');
  await expect(page).toHaveURL(/.*\/record/);
  await expect(page.locator('text=JEJU ISLAND SLOW TRIP').first()).toBeVisible();

  // 5. Add Moment 1 with Real Photo (Single photo)
  await page.click('button[aria-label="새 순간 기록"]');
  await page.fill('input[placeholder="예: 신주쿠 골목길"]', '애월 바다 카페');
  await page.fill('textarea', '바다를 보며 마시는 따뜻한 플랫화이트. 창밖으로 부서지는 파도가 마음을 편안하게 했다.');
  await page.click('button:has-text("☕")');

  // Upload cafe photo
  const moment1Chooser = page.waitForEvent('filechooser');
  await page.click('button:has-text("사진 추가")');
  const chooser1 = await moment1Chooser;
  await chooser1.setFiles(cafePhoto);
  await page.waitForTimeout(500);

  await page.click('button:has-text("순간 저장")');
  await expect(page.locator('text=바다를 보며 마시는 따뜻한 플랫화이트')).toBeVisible();

  // 6. Add Moment 2 with Real Photo (Ocean)
  await page.click('button[aria-label="새 순간 기록"]');
  await page.fill('input[placeholder="예: 신주쿠 골목길"]', '협재 해수욕장');
  await page.fill('textarea', '에메랄드빛 바다와 비양도가 한눈에 들어오는 풍경. 모래사장에 앉아 노을을 기다렸다.');
  await page.click('button:has-text("🏖️")');

  const moment2Chooser = page.waitForEvent('filechooser');
  await page.click('button:has-text("사진 추가")');
  const chooser2 = await moment2Chooser;
  await chooser2.setFiles(oceanPhoto);
  await page.waitForTimeout(500);

  await page.click('button:has-text("순간 저장")');
  await expect(page.locator('text=에메랄드빛 바다와 비양도')).toBeVisible();

  // 7. Add Moment 3 Text-only Essay (No photo)
  await page.click('button[aria-label="새 순간 기록"]');
  await page.fill('input[placeholder="예: 신주쿠 골목길"]', '영실코스 편백나무숲');
  await page.fill('textarea', '아무도 없는 숲길에서 바람에 스치는 나뭇잎 소리만 들렸다. 자연 속에 나를 온전히 맡긴 하루.');
  await page.click('button:has-text("🌿")');
  await page.click('button:has-text("순간 저장")');

  await page.screenshot({ path: 'test-results/persona_1_timeline.png' });

  // 8. Generate Album
  await page.click('button:has-text("앨범 만들기")');
  await expect(page).toHaveURL(/.*\/album/);

  // Verify BookViewer renders Cover, Intro, Moments, Essay, and Outro
  await expect(page.locator('text=JEJU ISLAND SLOW TRIP').first()).toBeVisible();
  await expect(page.locator('text=Prologue')).toBeVisible();
  await expect(page.locator('text=Moments recorded in travel')).toBeVisible();
  await expect(page.locator('text=기억의 마지막 장').first()).toBeVisible();

  // 9. Flip through album with Next Arrow
  const nextBtn = page.locator('button[aria-label="다음 페이지"]');
  if (await nextBtn.isVisible()) {
    await nextBtn.click();
    await page.waitForTimeout(400);
  }

  // 10. Share functionality
  await page.click('button[aria-label="앨범 공유하기"]');
  await expect(page.locator('text=클립보드에 복사되었습니다')).toBeVisible();

  await page.screenshot({ path: 'test-results/persona_1_album.png' });
});
