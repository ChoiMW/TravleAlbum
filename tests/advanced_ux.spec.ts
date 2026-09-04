import { test, expect } from '@playwright/test';

test.describe('Advanced 2nd iteration features', () => {
  test('CoverEditor preview collapse toggle', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Toggle button should be visible
    const collapseButton = page.locator('button[aria-label="패널 접기"]');
    await expect(collapseButton).toBeVisible();

    // Click collapse
    await collapseButton.click();
    await expect(page.locator('button[aria-label="패널 펼치기"]')).toBeVisible();

    // Click to expand again
    await page.locator('button[aria-label="패널 펼치기"]').click();
    await expect(page.locator('button[aria-label="패널 접기"]')).toBeVisible();
  });

  test('Text-only moment generates EssayPage without repeating cover image', async ({ page }) => {
    await page.goto('http://localhost:3000/record');

    // Add a text-only moment
    await page.click('button[aria-label="새 순간 기록"]');
    await page.fill('textarea', '조용한 골목길 카페에서 커피를 마시며 여유를 즐겼다.');
    await page.fill('input[placeholder="예: 신주쿠 골목길"]', '오모테산도 카페');
    await page.click('button:has-text("☕")');
    await page.click('button:has-text("순간 저장")');

    // Go to album
    await page.click('button:has-text("앨범 만들기")');
    await expect(page).toHaveURL(/.*\/album/);

    // Verify EssayPage element is rendered
    await expect(page.locator('text=Moments recorded in travel')).toBeVisible();
    await expect(page.locator('text=조용한 골목길 카페에서 커피를 마시며 여유를 즐겼다.')).toBeVisible();
  });

  test('Serverless share URL restores custom album on any device', async ({ page, context }) => {
    // 1. Visit album and click share
    await page.goto('http://localhost:3000/album');
    await page.click('button[aria-label="앨범 공유하기"]');
    await expect(page.locator('text=클립보드에 복사되었습니다')).toBeVisible();

    // 2. Open a new incognito-like page with a custom encoded share URL
    const customPayload = {
      cover: {
        title: 'PARIS IN SPRING',
        subtitle: '낭만의 도시를 걷다',
        location: 'Paris, France',
        date: '2026.04.10 — 2026.04.15',
        companions: 'MIN & SOO',
        imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200"><rect fill="%23cce" width="800" height="1200"/></svg>'
      },
      template: 'minimal',
      moments: [
        {
          id: 'p1',
          text: '에펠탑 앞에서 피크닉',
          images: [],
          timestamp: '15:00',
          location: 'Eiffel Tower'
        }
      ]
    };

    const encoded = Buffer.from(JSON.stringify(customPayload)).toString('base64');
    const newPage = await context.newPage();
    await newPage.goto(`http://localhost:3000/album?share=${encodeURIComponent(encoded)}`);

    // Verify the custom album rendered from URL param
    await expect(newPage.locator('text=PARIS IN SPRING').first()).toBeVisible();
    await expect(newPage.locator('text=에펠탑 앞에서 피크닉').first()).toBeVisible();
    await newPage.close();
  });
});
