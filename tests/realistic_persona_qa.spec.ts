import { test, expect } from '@playwright/test';

test.describe('Realistic Traveler Persona QA Deep Test', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate and clear storage for clean test slate
    await page.goto('http://localhost:3000');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('Scenario 1: Cover customization with long text, companions, & templates', async ({ page }) => {
    // Check initial home view
    await expect(page.locator('h1, h2').first()).toBeVisible();

    // 1. Check template switching
    await page.click('button:has-text("시티 매거진")');
    await page.waitForTimeout(300);
    await expect(page.locator('text=SHINJUKU').first()).toBeVisible();
    await page.screenshot({ path: 'test-results/cover_city_magazine.png' });

    await page.click('button:has-text("소프트 다이어리")');
    await page.waitForTimeout(300);
    await expect(page.locator('text=Our Memories')).toBeVisible();
    await page.screenshot({ path: 'test-results/cover_soft_diary.png' });

    await page.click('button:has-text("미니멀 에디토리얼")');
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'test-results/cover_minimal_editorial.png' });

    // 2. Open Detailed Editor
    await page.click('button:has-text("상세 편집")');
    await expect(page.locator('h3:has-text("상세 편집")')).toBeVisible();
    await page.screenshot({ path: 'test-results/cover_edit_sheet_open.png' });

    // Fill realistic 4-person trip to Jeju
    const inputs = page.locator('input[type="text"]');
    // Title
    await inputs.nth(0).fill('바람과 파도 그리고 우리들의 제주 이야기');
    // Location
    await inputs.nth(1).fill('제주 · 세화해변 & 비자림 & 올레길');
    // Date
    await inputs.nth(2).fill('2026.09.12 — 2026.09.15 (3박 4일)');
    // Subtitle
    await inputs.nth(3).fill('도시를 떠나 숲과 파도 소리에 온전히 스며들었던 늦여름의 눈부신 휴가');
    // Companions
    await inputs.nth(4).fill('민지, 수현, 지우, 그리고 나 🌿');

    await page.screenshot({ path: 'test-results/cover_edit_sheet_filled.png' });
    await page.click('button:has-text("완료")');

    // Verify rendered cover details
    await expect(page.locator('text=바람과').first()).toBeVisible();
    await expect(page.locator('text=민지, 수현, 지우, 그리고 나 🌿').first()).toBeVisible();
    await page.screenshot({ path: 'test-results/cover_jeju_minimal.png' });

    // Switch to City Magazine with this long Korean title & location
    await page.click('button:has-text("시티 매거진")');
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'test-results/cover_jeju_city.png' });

    // Switch to Soft Diary
    await page.click('button:has-text("소프트 다이어리")');
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'test-results/cover_jeju_diary.png' });

    // Proceed to Record Dashboard
    await page.click('button:has-text("이 표지로 확정하기")');
    await expect(page).toHaveURL(/.*\/record/);
    await expect(page.locator('text=바람과 파도 그리고 우리들의 제주 이야기').first()).toBeVisible();
    await page.screenshot({ path: 'test-results/record_dashboard_jeju.png' });
  });

  test('Scenario 2: Detailed timeline moments CRUD, multiple images, & edge cases', async ({ page }) => {
    await page.goto('http://localhost:3000/record');

    // 1. Verify default moments are rendered
    const defaultCards = page.locator('text=나리타 공항 도착!');
    await expect(defaultCards).toBeVisible();

    // 2. Add realistic Moment with multiple photos & long emotional diary
    await page.click('button[aria-label="새 순간 기록"]');
    await expect(page.locator('h3:has-text("새로운 순간 기록")')).toBeVisible();

    await page.fill('input[placeholder="예: 신주쿠 골목길"]', '세화해변 카페 공작소');
    await page.fill('input[placeholder="예: 14:30"]', '14:20');
    
    // Very long emotional diary entry
    const longDiary = `창가 자리에 앉아 주문한 한라봉 에이드를 마시며 끝없이 펼쳐진 에메랄드빛 바다를 바라보았다.
파도가 밀려왔다 나가는 리듬에 맞춰 친구들과 한참 동안 아무 말 없이 바다만 보았는데도, 그 침묵조차 너무나 편안하고 따뜻했다.
"우리 다음에도 꼭 이렇게 계절마다 여행 오자"며 약속했던 그 찰나의 순간이 마음에 깊이 남는다.`;
    await page.fill('textarea[placeholder="지금 어떤 감정이나 풍경을 마주하고 있나요?"]', longDiary);
    await page.click('button:has-text("☕")');

    // Inject mock images into the component's state or simulate upload
    // We can simulate file upload via buffer
    const buffer1 = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="skyblue" width="400" height="400"/><text x="50%" y="50%" fill="white">Sehwa Beach 1</text></svg>');
    const buffer2 = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="coral" width="400" height="400"/><text x="50%" y="50%" fill="white">Cafe 2</text></svg>');
    const buffer3 = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="teal" width="400" height="400"/><text x="50%" y="50%" fill="white">Waves 3</text></svg>');

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('button:has-text("사진 추가")');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([
      { name: 'sehwa1.svg', mimeType: 'image/svg+xml', buffer: buffer1 },
      { name: 'sehwa2.svg', mimeType: 'image/svg+xml', buffer: buffer2 },
      { name: 'sehwa3.svg', mimeType: 'image/svg+xml', buffer: buffer3 },
    ]);

    await page.waitForTimeout(500);
    // Verify 3 photos preview attached
    await expect(page.locator('text=첨부된 사진 (3장)')).toBeVisible();

    // Test removing one photo preview
    const removeBtn = page.locator('button[title="사진 삭제"]').first();
    await removeBtn.click();
    await expect(page.locator('text=첨부된 사진 (2장)')).toBeVisible();

    await page.click('button:has-text("순간 저장")');

    // Verify card in timeline
    await expect(page.locator('text=세화해변 카페 공작소')).toBeVisible();
    await expect(page.locator('text=창가 자리에 앉아 주문한 한라봉 에이드를 마시며')).toBeVisible();
    await page.screenshot({ path: 'test-results/timeline_multi_photo_card.png' });

    // 3. Add a text-only moment (no images)
    await page.click('button[aria-label="새 순간 기록"]');
    await page.fill('input[placeholder="예: 신주쿠 골목길"]', '숙소 앞 돌담길');
    await page.fill('input[placeholder="예: 14:30"]', '21:00');
    await page.fill('textarea[placeholder="지금 어떤 감정이나 풍경을 마주하고 있나요?"]', '밤이 되니 풀벌레 소리와 바람 소리만 가득하다. 온전한 고요함.');
    await page.click('button:has-text("🌿")');
    await page.click('button:has-text("순간 저장")');
    await expect(page.locator('text=밤이 되니 풀벌레 소리와 바람 소리만 가득하다.')).toBeVisible();
    await page.screenshot({ path: 'test-results/timeline_text_only_card.png' });

    // 4. Test validation error when empty
    await page.click('button[aria-label="새 순간 기록"]');
    await page.click('button:has-text("순간 저장")');
    await expect(page.locator('text=사진을 추가하거나 짧은 메모를 남겨주세요.')).toBeVisible();
    await page.screenshot({ path: 'test-results/moment_validation_error.png' });
    await page.click('button:has-text("닫기")');

    // 5. Test Editing a moment
    const editButtons = page.locator('button:has-text("수정")');
    await editButtons.last().click();
    await expect(page.locator('h3:has-text("기록 수정하기")')).toBeVisible();
    await page.fill('input[placeholder="예: 신주쿠 골목길"]', '숙소 앞 밤 돌담길과 쏟아지는 별');
    await page.click('button:has-text("수정 완료")');
    await expect(page.locator('text=숙소 앞 밤 돌담길과 쏟아지는 별')).toBeVisible();

    // 6. Delete moments and test Empty State
    // Accept confirm dialog automatically
    page.on('dialog', async dialog => await dialog.accept());

    const deleteButtons = page.locator('button:has-text("삭제")');
    const count = await deleteButtons.count();
    for (let i = 0; i < count; i++) {
      await page.locator('button:has-text("삭제")').first().click();
      await page.waitForTimeout(200);
    }

    // Verify Empty state
    await expect(page.locator('text=아직 기록된 순간이 없습니다.')).toBeVisible();
    await expect(page.locator('text=첫 순간 기록하기')).toBeVisible();
    await page.screenshot({ path: 'test-results/timeline_empty_state.png' });

    // Check Album page when moments are empty
    await page.click('button:has-text("앨범 만들기")');
    await expect(page).toHaveURL(/.*\/album/);
    // When moments is empty, pages should still have Cover, Intro, Outro (3 pages)
    await expect(page.locator('text=1 / 3')).toBeVisible();
    await page.screenshot({ path: 'test-results/album_empty_moments_view.png' });
  });

  test('Scenario 3: BookViewer interaction, page flipping, keyboard, swipe, & sharing', async ({ page }) => {
    // Navigate with initial default moments
    await page.goto('http://localhost:3000/album');

    // Check page counter (Cover + Intro + 2 moments + Outro = 5 pages)
    await expect(page.locator('text=1 / 5')).toBeVisible();

    // Take screenshot of cover in album
    await page.screenshot({ path: 'test-results/album_page_1_cover.png' });

    // Test Desktop Next Page arrow click
    const nextBtn = page.locator('button[aria-label="다음 페이지"]');
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
    await page.waitForTimeout(600);
    await expect(page.locator('text=2 / 5')).toBeVisible();
    await expect(page.locator('text=Prologue')).toBeVisible();
    await page.screenshot({ path: 'test-results/album_page_2_intro.png' });

    // Test Keyboard navigation (ArrowRight) to moment 1 (single-photo)
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(600);
    await expect(page.locator('text=3 / 5')).toBeVisible();
    await page.screenshot({ path: 'test-results/album_page_3_photo.png' });

    // Test Keyboard navigation (ArrowRight) to moment 2 (collage)
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(600);
    await expect(page.locator('text=4 / 5')).toBeVisible();
    await page.screenshot({ path: 'test-results/album_page_4_collage.png' });

    // Test Keyboard navigation (ArrowRight) to Outro
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(600);
    await expect(page.locator('text=5 / 5')).toBeVisible();
    await expect(page.locator('text=Epilogue')).toBeVisible();
    await expect(page.locator('text=기억의 마지막 장')).toBeVisible();
    await page.screenshot({ path: 'test-results/album_page_5_outro.png' });

    // Test "처음부터 다시 보기" button
    await page.click('button:has-text("처음부터 다시 보기")');
    await page.waitForTimeout(600);
    await expect(page.locator('text=1 / 5')).toBeVisible();

    // Test Share button & Toast notification
    await page.click('button[aria-label="앨범 공유하기"]');
    await expect(page.locator('text=앨범 링크가 클립보드에 복사되었습니다! 🎉')).toBeVisible();
    await page.screenshot({ path: 'test-results/album_share_toast.png' });

    // Test Return to record
    await page.click('button:has-text("← 기록으로")');
    await expect(page).toHaveURL(/.*\/record/);
  });

  test('Scenario 4: Mobile Viewport (iPhone 14) test & layout responsiveness', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
    });
    const page = await context.newPage();
    await page.goto('http://localhost:3000');

    // Screenshot of Mobile Cover Editor
    await page.screenshot({ path: 'test-results/mobile_cover_minimal.png' });

    // Verify Cover editor on mobile
    await expect(page.locator('button:has-text("이 표지로 확정하기")')).toBeVisible();
    
    // Check that detailed edit modal fits within mobile viewport
    await page.click('button:has-text("상세 편집")');
    await expect(page.locator('h3:has-text("상세 편집")')).toBeVisible();
    await page.screenshot({ path: 'test-results/mobile_cover_edit_modal.png' });
    await page.click('button:has-text("완료")');

    // Go to record
    await page.click('button:has-text("이 표지로 확정하기")');
    await expect(page).toHaveURL(/.*\/record/);
    await page.screenshot({ path: 'test-results/mobile_timeline.png' });

    // Verify + button is accessible
    const addBtn = page.locator('button[aria-label="새 순간 기록"]');
    await expect(addBtn).toBeVisible();

    // Open add moment modal on mobile
    await addBtn.click();
    await expect(page.locator('h3:has-text("새로운 순간 기록")')).toBeVisible();
    await page.screenshot({ path: 'test-results/mobile_add_modal.png' });
    
    // Close modal
    await page.click('button:has-text("닫기")');

    // Go to album
    await page.click('button:has-text("앨범 만들기")');
    await expect(page).toHaveURL(/.*\/album/);
    await page.screenshot({ path: 'test-results/mobile_album_cover.png' });

    // On mobile, floating desktop arrows (‹, ›) should be hidden
    const leftArrow = page.locator('button[aria-label="이전 페이지"]');
    await expect(leftArrow).toBeHidden();

    // Touch swipe simulation to page 2
    await page.evaluate(() => {
      const container = document.querySelector('.snap-x');
      if (container) {
        container.scrollTo({ left: 390, behavior: 'smooth' });
      }
    });
    await page.waitForTimeout(600);
    await expect(page.locator('text=2 / 5')).toBeVisible();
    await page.screenshot({ path: 'test-results/mobile_album_intro.png' });

    await context.close();
  });
});
