import { test, expect } from '@playwright/test';

test.describe('Edge Cases and UX Boundary Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('Edge Case 1: Ultra-long text, special characters, and XSS safety', async ({ page }) => {
    // Detailed edit
    await page.click('button:has-text("상세 편집")');
    const inputs = page.locator('input[type="text"]');

    const ultraLongTitle = '이것은아주아주긴여행제목입니다공백없이계속이어지는문자열ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890특수문자!@#$%^&*()_+';
    const xssSubtitle = '<script>alert("hack")</script> <b>볼드 태그 테스트</b> & "따옴표" \'작은따옴표\'';
    const ultraLongCompanions = '김철수, 이영희, 박지성, 손흥민, 봉준호, 아이유, 유재석, 이효리, 방탄소년단, 블랙핑크';

    await inputs.nth(0).fill(ultraLongTitle);
    await inputs.nth(3).fill(xssSubtitle);
    await inputs.nth(4).fill(ultraLongCompanions);
    await page.click('button:has-text("완료")');

    // Check that script did not execute, text is safely escaped as text
    await expect(page.locator('text=<script>alert("hack")</script>').first()).toBeVisible();
    await page.screenshot({ path: 'test-results/edge_long_title_cover.png' });

    // Go to record
    await page.click('button:has-text("이 표지로 확정하기")');
    await expect(page).toHaveURL(/.*\/record/);

    // Add a moment with 1000 characters
    await page.click('button[aria-label="새 순간 기록"]');
    const veryLongJournal = '여행을 떠나기 전날 밤, 짐을 싸면서 느꼈던 설렘부터 공항에 도착해 비행기에 탑승할 때의 떨림까지. '.repeat(20);
    await page.fill('textarea', veryLongJournal);
    await page.click('button:has-text("순간 저장")');

    await page.screenshot({ path: 'test-results/edge_long_journal_timeline.png' });

    // Go to album and check rendering
    await page.click('button:has-text("앨범 만들기")');
    await expect(page).toHaveURL(/.*\/album/);

    // Check cover page with long title
    await page.screenshot({ path: 'test-results/edge_album_cover_long.png' });

    // Check Outro page with long companions
    const pageDots = page.locator('button[aria-label*="페이지로 이동"]');
    await pageDots.last().click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/edge_album_outro_long.png' });
  });

  test('Edge Case 2: Moments with 5 or more photos (Collage overflow)', async ({ page }) => {
    await page.goto('http://localhost:3000/record');

    await page.click('button[aria-label="새 순간 기록"]');
    await page.fill('input[placeholder="예: 신주쿠 골목길"]', '다섯 장 이상의 사진 테스트');
    await page.fill('textarea', '사진이 6장 등록되었을 때 콜라주 페이지는 어떻게 처리할까?');

    // Create 6 dummy SVG images
    const files = [1, 2, 3, 4, 5, 6].map(i => ({
      name: `photo_${i}.svg`,
      mimeType: 'image/svg+xml',
      buffer: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect fill="hsl(${i * 50}, 70%, 50%)" width="300" height="300"/><text x="50%" y="50%" fill="white">Photo ${i}</text></svg>`)
    }));

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('button:has-text("사진 추가")');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(files);

    await page.waitForTimeout(500);
    await expect(page.locator('text=첨부된 사진 (6장)')).toBeVisible();

    await page.click('button:has-text("순간 저장")');
    await page.screenshot({ path: 'test-results/edge_timeline_6_photos.png' });

    // Open album and navigate to that moment page
    await page.click('button:has-text("앨범 만들기")');
    await expect(page).toHaveURL(/.*\/album/);

    // Navigate to the collage page
    // Cover(1) -> Intro(2) -> m1(3) -> m2(4) -> 6-photos(5) -> Outro(6)
    const pageDots = page.locator('button[aria-label*="페이지로 이동"]');
    await pageDots.nth(4).click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'test-results/edge_album_6_photos_collage.png' });
  });

  test('Edge Case 3: Refresh & LocalStorage Persistence check', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Change template to 'diary'
    await page.click('button:has-text("소프트 다이어리")');
    
    // Edit cover title
    await page.click('button:has-text("상세 편집")');
    await page.locator('input[type="text"]').first().fill('PERSISTENCE TEST ALBUM');
    await page.click('button:has-text("완료")');

    // Go to record and add unique moment
    await page.click('button:has-text("이 표지로 확정하기")');
    await page.click('button[aria-label="새 순간 기록"]');
    await page.fill('input[placeholder="예: 신주쿠 골목길"]', '영속성 테스트 장소');
    await page.fill('textarea', '이 문장은 새로고침 후에도 살아남아야 합니다.');
    await page.click('button:has-text("순간 저장")');

    // Hard reload the browser
    await page.reload();
    await page.waitForTimeout(500);

    // Verify title and moment persisted
    await expect(page.locator('text=PERSISTENCE TEST ALBUM').first()).toBeVisible();
    await expect(page.locator('text=이 문장은 새로고침 후에도 살아남아야 합니다.')).toBeVisible();


    // Go back to home cover editor and check template & title persisted
    await page.click('button[aria-label="표지 디자인으로 돌아가기"]');
    await expect(page).toHaveURL(/.*localhost:3000\/?$/);
    await expect(page.locator('text=PERSISTENCE TEST ALBUM').first()).toBeVisible();
    // Verify soft diary styling remains active
    await expect(page.locator('text=Our Memories')).toBeVisible();
  });
});
