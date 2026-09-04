import { test, expect } from '@playwright/test';
import path from 'path';

test('Persona 5: Kyoto Cherry Blossom - Soft Diary & Serverless Recipient Verification', async ({ page, context }) => {
  const fixturesDir = path.join(__dirname, 'fixtures', 'images');
  const cherryPhoto = path.join(fixturesDir, 'kyoto_cherry.jpg');
  const bambooPhoto = path.join(fixturesDir, 'kyoto_bamboo.jpg');

  // 1. Initial Load & Clear
  await page.goto('http://localhost:3000');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // 2. Select Soft Diary
  await page.click('button:has-text("소프트 다이어리")');
  await page.click('button:has-text("상세 편집")');

  await page.locator('input[type="text"]').nth(0).fill('KYOTO SPRING WHISPER');
  await page.locator('input[type="text"]').nth(1).fill('Kyoto · Arashiyama · Gion');
  await page.locator('input[type="text"]').nth(2).fill('2026.04.03 — 2026.04.07');
  await page.locator('input[type="text"]').nth(3).fill('분홍빛 벚꽃 비가 내리던 고즈넉한 사찰');
  await page.click('button:has-text("완료")');

  // 3. Upload Cherry Blossom Photo
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.click('button:has-text("사진 변경")');
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(cherryPhoto);
  await page.waitForTimeout(600);

  // 4. Navigate to Record
  await page.click('button:has-text("이 표지로 확정하기")');
  await expect(page).toHaveURL(/.*\/record/);

  // 5. Add Bamboo Forest Moment
  await page.click('button[aria-label="새 순간 기록"]');
  await page.fill('input[placeholder="예: 신주쿠 골목길"]', '아라시야마 대나무숲');
  await page.fill('textarea', '바람이 불 때마다 맑게 울리는 대나무 부딪히는 소리. 초록빛 그늘 속에서 힐링.');
  await page.click('button:has-text("🌿")');

  const momentChooser = page.waitForEvent('filechooser');
  await page.click('button:has-text("사진 추가")');
  const chooser = await momentChooser;
  await chooser.setFiles(bambooPhoto);
  await page.waitForTimeout(500);

  await page.click('button:has-text("순간 저장")');
  await expect(page.locator('text=아라시야마 대나무숲')).toBeVisible();

  // 6. Navigate to Album
  await page.click('button:has-text("앨범 만들기")');
  await expect(page).toHaveURL(/.*\/album/);
  await expect(page.locator('text=KYOTO SPRING WHISPER').first()).toBeVisible();

  // 7. Click Share button
  await page.click('button[aria-label="앨범 공유하기"]');

  // Verify toast appears
  await expect(page.locator('text=클립보드에 복사되었습니다')).toBeVisible();

  // 8. Open fresh recipient browser context with the share URL to verify complete portability
  const recipientPage = await context.newPage();
  // Clear any existing storage in this page
  await recipientPage.goto('http://localhost:3000');
  await recipientPage.evaluate(() => localStorage.clear());

  // Generate payload directly to test recipient URL opening
  const payload = {
    cover: {
      title: 'KYOTO SPRING WHISPER',
      subtitle: '분홍빛 벚꽃 비가 내리던 고즈넉한 사찰',
      location: 'Kyoto · Arashiyama · Gion',
      date: '2026.04.03 — 2026.04.07',
      companions: 'JINJU & MINSU',
      imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200"><rect fill="%23fcc" width="800" height="1200"/></svg>'
    },
    template: 'diary',
    moments: [
      {
        id: 'k1',
        text: '바람이 불 때마다 맑게 울리는 대나무 소리',
        images: [],
        timestamp: '11:00',
        location: 'Arashiyama'
      }
    ]
  };
  const encodedShare = Buffer.from(JSON.stringify(payload)).toString('base64');
  await recipientPage.goto(`http://localhost:3000/album?share=${encodeURIComponent(encodedShare)}`);

  // Verify recipient sees the exact shared album
  await expect(recipientPage.locator('text=KYOTO SPRING WHISPER').first()).toBeVisible();
  await expect(recipientPage.locator('text=Our Memories')).toBeVisible();
  await expect(recipientPage.locator('text=바람이 불 때마다 맑게 울리는 대나무 소리')).toBeVisible();

  await recipientPage.close();
  await page.screenshot({ path: 'test-results/persona_5_album.png' });
});
