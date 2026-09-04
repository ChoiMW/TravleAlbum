import { test, expect } from '@playwright/test';
import path from 'path';

test('Persona 3: Da Nang Family Vacation - Soft Diary with Companions & Moment CRUD', async ({ page }) => {
  const fixturesDir = path.join(__dirname, 'fixtures', 'images');
  const resortPhoto = path.join(fixturesDir, 'danang_resort.jpg');
  const banahillsPhoto = path.join(fixturesDir, 'danang_banahills.jpg');

  // 1. Initial Load & Clear
  await page.goto('http://localhost:3000');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // 2. Select Soft Diary
  await page.click('button:has-text("소프트 다이어리")');
  await page.click('button:has-text("상세 편집")');

  await page.locator('input[type="text"]').nth(0).fill('DANANG FAMILY HOLIDAY');
  await page.locator('input[type="text"]').nth(1).fill('Da Nang · Hoi An');
  await page.locator('input[type="text"]').nth(2).fill('2026.05.01 — 2026.05.05');
  await page.locator('input[type="text"]').nth(3).fill('온 가족이 함께 웃고 즐겼던 힐링 베트남');
  
  // Fill 4 companions
  await page.locator('input[placeholder="예: JINJU & MINSU"]').fill('아빠, 엄마, 민우, 서연');
  await page.click('button:has-text("완료")');

  // 3. Upload Resort Photo
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.click('button:has-text("사진 변경")');
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(resortPhoto);
  await page.waitForTimeout(600);

  await expect(page.locator('text=아빠, 엄마, 민우, 서연').first()).toBeVisible();
  await page.screenshot({ path: 'test-results/persona_3_cover.png' });

  // 4. Navigate to Record
  await page.click('button:has-text("이 표지로 확정하기")');
  await expect(page).toHaveURL(/.*\/record/);

  // 5. Add Moment 1: Bana Hills
  await page.click('button[aria-label="새 순간 기록"]');
  await page.fill('input[placeholder="예: 신주쿠 골목길"]', '바나힐 골든브릿지');
  await page.fill('textarea', '구름 위를 걷는 듯했던 거대한 손 조형물. 부모님도 너무 신기해하셨다.');
  await page.click('button:has-text("✨")');

  const moment1Chooser = page.waitForEvent('filechooser');
  await page.click('button:has-text("사진 추가")');
  const chooser1 = await moment1Chooser;
  await chooser1.setFiles(banahillsPhoto);
  await page.waitForTimeout(500);
  await page.click('button:has-text("순간 저장")');

  // 6. Add Moment 2 (Temporary moment to test deletion)
  await page.click('button[aria-label="새 순간 기록"]');
  await page.fill('input[placeholder="예: 신주쿠 골목길"]', '잘못 입력한 장소');
  await page.fill('textarea', '이 기록은 테스트용으로 곧 삭제될 예정입니다.');
  await page.click('button:has-text("순간 저장")');
  await expect(page.locator('text=잘못 입력한 장소')).toBeVisible();

  // 7. Delete Moment 2
  page.on('dialog', dialog => dialog.accept());
  const deleteButtons = page.locator('button:has-text("삭제")');
  await deleteButtons.last().click();
  await page.waitForTimeout(400);
  await expect(page.locator('text=잘못 입력한 장소')).toHaveCount(0);

  // 8. Edit Moment 1
  const editButtons = page.locator('button:has-text("수정")');
  await editButtons.first().click();
  await page.fill('textarea', '구름 위를 걷는 듯했던 골든브릿지! 온 가족이 기념사진을 100장 넘게 찍었다.');
  await page.click('button:has-text("수정 완료")');
  await expect(page.locator('text=기념사진을 100장 넘게 찍었다')).toBeVisible();

  // 9. Navigate to Album and verify Soft Diary polaroid presentation
  await page.click('button:has-text("앨범 만들기")');
  await expect(page).toHaveURL(/.*\/album/);

  await expect(page.locator('text=DANANG FAMILY HOLIDAY').first()).toBeVisible();
  await expect(page.locator('text=Our Memories')).toBeVisible();
  await expect(page.locator('text=기억의 마지막 장').first()).toBeVisible();

  await page.screenshot({ path: 'test-results/persona_3_album.png' });
});
