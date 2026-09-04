import { test, expect } from '@playwright/test';

test('Check Text-Only Moment Album Page Rendering', async ({ page }) => {
  await page.goto('http://localhost:3000/record');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // Add text-only moment
  await page.click('button[aria-label="새 순간 기록"]');
  await page.fill('input[placeholder="예: 신주쿠 골목길"]', '제주 한라산 자락 고요한 밤');
  await page.fill('textarea', '창밖으로 쏟아지는 별빛과 풀벌레 소리만이 밤을 채운다. 이 조용한 순간이 이번 여행에서 가장 오랫동안 기억될 것 같다.');
  await page.click('button:has-text("✨")');
  await page.click('button:has-text("순간 저장")');

  // Go to album
  await page.click('button:has-text("앨범 만들기")');
  await expect(page).toHaveURL(/.*\/album/);

  // Default moments 2개 + 이번에 추가한 text-only 1개 = moments 3개
  // Cover(1) -> Intro(2) -> m1(3) -> m2(4) -> Text-only(5) -> Outro(6)
  const pageDots = page.locator('button[aria-label*="페이지로 이동"]');
  await pageDots.nth(4).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'test-results/album_page_text_only_moment.png' });
});
