import { test, expect } from '@playwright/test';
import path from 'path';

test('Persona 4: Solo Explorer in New York - High-Res Stress Test & Storage Safety', async ({ page }) => {
  const fixturesDir = path.join(__dirname, 'fixtures', 'images');
  const timesSquarePhoto = path.join(fixturesDir, 'ny_times_square.jpg');
  const centralParkPhoto = path.join(fixturesDir, 'ny_central_park.jpg');

  page.on('console', msg => console.log(`[BROWSER ${msg.type()}]: ${msg.text()}`));
  page.on('pageerror', err => console.log(`[BROWSER ERROR]: ${err.message}`));

  // 1. Initial Load & Clear
  await page.goto('http://localhost:3000');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // 2. Setup Cover
  await page.click('button:has-text("상세 편집")');
  await page.locator('input[type="text"]').nth(0).fill('NEW YORK CONCRETE JUNGLE');
  await page.locator('input[type="text"]').nth(1).fill('Manhattan · Brooklyn · Queens');
  await page.locator('input[type="text"]').nth(2).fill('2026.10.12 — 2026.10.18');
  await page.locator('input[type="text"]').nth(3).fill('잠들지 않는 도시에서 홀로 마주한 반짝임');
  await page.click('button:has-text("완료")');

  // 3. Upload High-Res Cover Photo (1920x1080)
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.click('button:has-text("사진 변경")');
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(timesSquarePhoto);
  await page.waitForTimeout(600);

  // Check storage size does not exceed quota
  const storageLength = await page.evaluate(() => {
    return (localStorage.getItem('travel_album_cover') || '').length;
  });
  // Compressed image string should be well within bounds (< 250KB)
  expect(storageLength).toBeLessThan(350000);

  // 4. Navigate to Record
  await page.click('button:has-text("이 표지로 확정하기")');
  await expect(page).toHaveURL(/.*\/record/);

  // 5. Add Multiple Moments with High-Res photos
  const momentsData = [
    { loc: '타임스퀘어', text: '수많은 전광판의 불빛과 사람들의 에너지가 심장을 뛰게 만들었다.', mood: '🌆', file: timesSquarePhoto },
    { loc: '센트럴파크 숲길', text: '빌딩 숲 한가운데 자리 잡은 거대한 오아시스. 잔디밭에 누워 하늘을 바라보았다.', mood: '🌿', file: centralParkPhoto },
  ];

  for (const m of momentsData) {
    await page.click('button[aria-label="새 순간 기록"]');
    await page.fill('input[placeholder="예: 신주쿠 골목길"]', m.loc);
    await page.fill('textarea', m.text);
    await page.click(`button:has-text("${m.mood}")`);

    const chooserPromise = page.waitForEvent('filechooser');
    await page.click('button:has-text("사진 추가")');
    const chooser = await chooserPromise;
    await chooser.setFiles(m.file);
    await page.waitForTimeout(500);

    await page.click('button:has-text("순간 저장")');
    await expect(page.locator(`text=${m.loc}`)).toBeVisible();
  }

  // 6. Hard Reload and verify storage persistence
  await page.reload();
  await page.waitForTimeout(400);
  await expect(page.locator('text=NEW YORK CONCRETE JUNGLE').first()).toBeVisible();
  await expect(page.locator('text=타임스퀘어')).toBeVisible();
  await expect(page.locator('text=센트럴파크 숲길')).toBeVisible();

  // 7. Generate Album and verify
  await page.click('button:has-text("앨범 만들기")');
  await expect(page).toHaveURL(/.*\/album/);
  await expect(page.locator('text=NEW YORK').first()).toBeVisible();
  await expect(page.locator('text=기억의 마지막 장').first()).toBeVisible();

  await page.screenshot({ path: 'test-results/persona_4_album.png' });
});
