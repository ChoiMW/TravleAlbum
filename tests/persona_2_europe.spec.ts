import { test, expect } from '@playwright/test';
import path from 'path';

test('Persona 2: Europe Backpacking - City Magazine with Multi-Photo Collages', async ({ page }) => {
  const fixturesDir = path.join(__dirname, 'fixtures', 'images');
  const eiffelPhoto = path.join(fixturesDir, 'paris_eiffel.jpg');
  const louvrePhoto = path.join(fixturesDir, 'paris_louvre.jpg');
  const bridgePhoto = path.join(fixturesDir, 'london_bridge.jpg');
  const colosseumPhoto = path.join(fixturesDir, 'rome_colosseum.jpg');

  // 1. Initial Load & Clear
  await page.goto('http://localhost:3000');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // 2. Select City Magazine Template
  await page.click('button:has-text("시티 매거진")');
  await page.click('button:has-text("상세 편집")');

  await page.locator('input[type="text"]').nth(0).fill('EUROPE GRAND TOUR');
  await page.locator('input[type="text"]').nth(1).fill('Paris · London · Rome');
  await page.locator('input[type="text"]').nth(2).fill('2026.07.01 — 2026.07.21');
  await page.locator('input[type="text"]').nth(3).fill('21일간의 낭만과 예술의 방랑자');
  await page.click('button:has-text("완료")');

  // 3. Upload Eiffel Cover Photo
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.click('button:has-text("사진 변경")');
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(eiffelPhoto);
  await page.waitForTimeout(600);

  // Check extracted main city in uppercase
  await expect(page.locator('text=PARIS').first()).toBeVisible();
  await page.screenshot({ path: 'test-results/persona_2_cover.png' });

  // 4. Navigate to Record
  await page.click('button:has-text("이 표지로 확정하기")');
  await expect(page).toHaveURL(/.*\/record/);
  await expect(page.locator('text=EUROPE GRAND TOUR').first()).toBeVisible();

  // 5. Add 2-photo Moment (Symmetric Collage)
  await page.click('button[aria-label="새 순간 기록"]');
  await page.fill('input[placeholder="예: 신주쿠 골목길"]', '파리에서 런던으로');
  await page.fill('textarea', '루브르 모나리자를 마주하고, 다음 날 유로스타로 런던 타워브리지에 닿았다.');
  await page.click('button:has-text("✨")');

  const moment1Chooser = page.waitForEvent('filechooser');
  await page.click('button:has-text("사진 추가")');
  const chooser1 = await moment1Chooser;
  await chooser1.setFiles([louvrePhoto, bridgePhoto]);
  await page.waitForTimeout(600);
  await page.click('button:has-text("순간 저장")');

  // 6. Add 3-photo Moment (Featured Top + 2 Square)
  await page.click('button[aria-label="새 순간 기록"]');
  await page.fill('input[placeholder="예: 신주쿠 골목길"]', '로마의 유적 탐방');
  await page.fill('textarea', '콜로세움의 거대한 웅장함과 고대 도시의 흔적들.');
  await page.click('button:has-text("🏛️")').catch(() => page.click('button:has-text("✨")'));

  const moment2Chooser = page.waitForEvent('filechooser');
  await page.click('button:has-text("사진 추가")');
  const chooser2 = await moment2Chooser;
  await chooser2.setFiles([colosseumPhoto, louvrePhoto, bridgePhoto]);
  await page.waitForTimeout(600);
  await page.click('button:has-text("순간 저장")');

  // 7. Add 5-photo Moment (Stress collage with +2 badge)
  await page.click('button[aria-label="새 순간 기록"]');
  await page.fill('input[placeholder="예: 신주쿠 골목길"]', '유럽의 모든 순간들');
  await page.fill('textarea', '카메라 셔터를 멈출 수 없었던 환상적인 도시의 야경과 거리 풍경.');
  await page.click('button:has-text("📸")');

  const moment3Chooser = page.waitForEvent('filechooser');
  await page.click('button:has-text("사진 추가")');
  const chooser3 = await moment3Chooser;
  await chooser3.setFiles([eiffelPhoto, louvrePhoto, bridgePhoto, colosseumPhoto, eiffelPhoto]);
  await page.waitForTimeout(600);
  await page.click('button:has-text("순간 저장")');

  // 8. Open Album and verify collages & +2 overlay
  await page.click('button:has-text("앨범 만들기")');
  await expect(page).toHaveURL(/.*\/album/);

  // Check presence of collage badges and outro
  await expect(page.locator('text=PARIS').first()).toBeVisible();
  await expect(page.locator('text=더보기')).toBeVisible();
  await expect(page.locator('text=+2')).toBeVisible();

  await page.screenshot({ path: 'test-results/persona_2_album.png' });
});
