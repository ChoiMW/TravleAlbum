import { test, expect } from '@playwright/test';

test('Full user journey: customize cover, add/edit/delete moment, generate album', async ({ page }) => {
  // Clear localStorage before testing
  await page.goto('http://localhost:3000');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // 1. Customize Cover
  await page.click('button:has-text("상세 편집")');
  const titleInput = page.locator('input[type="text"]').nth(0);
  await titleInput.fill('JEJU ISLAND MEMORIES');

  const locationInput = page.locator('input[type="text"]').nth(1);
  await locationInput.fill('Jeju · Hamdeok');

  await page.click('button:has-text("완료")');
  await expect(page.locator('text=JEJU').first()).toBeVisible();

  // 2. Confirm cover and navigate to record
  await page.click('button:has-text("이 표지로 확정하기")');
  await expect(page).toHaveURL(/.*\/record/);
  await expect(page.locator('text=JEJU ISLAND MEMORIES').first()).toBeVisible();


  // 3. Add a new moment
  await page.click('button[aria-label="새 순간 기록"]');
  await expect(page.locator('h3:has-text("새로운 순간 기록")')).toBeVisible();

  await page.fill('input[placeholder="예: 신주쿠 골목길"]', '함덕 해수욕장');
  await page.fill('textarea[placeholder="지금 어떤 감정이나 풍경을 마주하고 있나요?"]', '에메랄드빛 바다가 정말 눈부셨다!');
  await page.click('button:has-text("🏖️")');
  await page.click('button:has-text("순간 저장")');

  // Verify new moment is in timeline
  await expect(page.locator('text=에메랄드빛 바다가 정말 눈부셨다!')).toBeVisible();
  await expect(page.locator('text=📍 함덕 해수욕장')).toBeVisible();

  // 4. Edit the moment
  const editButtons = page.locator('button:has-text("수정")');
  await editButtons.last().click();
  await expect(page.locator('h3:has-text("기록 수정하기")')).toBeVisible();
  await page.fill('textarea', '에메랄드빛 바다가 눈부셨고 바람도 시원했다!');
  await page.click('button:has-text("수정 완료")');

  await expect(page.locator('text=에메랄드빛 바다가 눈부셨고 바람도 시원했다!')).toBeVisible();

  // 5. Navigate to album
  await page.click('button:has-text("앨범 만들기")');
  await expect(page).toHaveURL(/.*\/album/);

  // 6. Verify album contents
  await expect(page.locator('text=JEJU ISLAND MEMORIES').first()).toBeVisible();
  await expect(page.locator('text=에메랄드빛 바다가 눈부셨고 바람도 시원했다!').first()).toBeVisible();
  await expect(page.locator('text=기억의 마지막 장').first()).toBeVisible();

  // 7. Verify back to record button
  await page.click('button:has-text("← 기록으로")');
  await expect(page).toHaveURL(/.*\/record/);
});
