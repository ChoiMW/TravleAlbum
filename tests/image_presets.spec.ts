import { test, expect } from '@playwright/test';

test.describe('Image Preset Templates Feature', () => {
  test('CoverEditor and RecordDashboard image preset template picker works seamlessly', async ({ page }) => {
    // 1. Visit CoverEditor
    await page.goto('http://localhost:3000/');

    // 2. Open preset modal from main panel
    const presetBtn = page.getByRole('button', { name: '기본 템플릿' });
    await expect(presetBtn).toBeVisible();
    await presetBtn.click();

    // Verify modal elements
    await expect(page.getByText('표지 기본 이미지 템플릿')).toBeVisible();
    await expect(page.getByRole('button', { name: /도시·명소/ })).toBeVisible();

    // Filter by city category
    await page.getByRole('button', { name: /도시·명소/ }).click();
    await expect(page.getByText('파리 에펠탑 야경')).toBeVisible();

    // Select Paris Eiffel Tower
    await page.getByText('파리 에펠탑 야경').click();
    await page.getByRole('button', { name: /선택 적용/ }).click();

    // Modal should close
    await expect(page.getByText('표지 기본 이미지 템플릿')).not.toBeVisible();

    // 3. Test preset modal from inside "상세 편집" drawer
    await page.getByRole('button', { name: '상세 편집' }).click();
    const drawerPresetBtn = page.getByRole('button', { name: '기본 템플릿 갤러리' });
    await expect(drawerPresetBtn).toBeVisible();
    await drawerPresetBtn.click();

    await expect(page.getByText('표지 기본 이미지 템플릿')).toBeVisible();
    await page.getByRole('button', { name: '취소' }).click();
    await expect(page.getByText('표지 기본 이미지 템플릿')).not.toBeVisible();
    await page.getByRole('button', { name: '완료' }).click();

    // 4. Move to RecordDashboard
    await page.goto('http://localhost:3000/record');

    // Open add moment modal
    const addMomentBtn = page.getByRole('button', { name: '새 순간 기록' });
    await addMomentBtn.click();

    // Click preset template button
    const recordPresetBtn = page.getByRole('button', { name: '기본 템플릿' });
    await expect(recordPresetBtn).toBeVisible();
    await recordPresetBtn.click();

    // Verify multiple selection modal
    await expect(page.getByText('순간 기록 이미지 템플릿')).toBeVisible();

    // Switch to nature category
    await page.getByRole('button', { name: /자연·숲/ }).click();
    await expect(page.getByText('아라시야마 대나무숲')).toBeVisible();
    await expect(page.getByText('교토 만개한 벚꽃길')).toBeVisible();

    // Select 2 photos
    await page.getByText('아라시야마 대나무숲').click();
    await page.getByText('교토 만개한 벚꽃길').click();

    // Apply 2 selected photos
    await page.getByRole('button', { name: /선택 적용/ }).click();
    await expect(page.getByText('순간 기록 이미지 템플릿')).not.toBeVisible();

    // Verify attached photos count in moment modal
    await expect(page.getByText('첨부된 사진 (2장)')).toBeVisible();

    // Fill in moment details and save
    await page.locator('input[placeholder="예: 신주쿠 골목길"]').fill('교토 아라시야마');
    await page.locator('textarea[placeholder="지금 어떤 감정이나 풍경을 마주하고 있나요?"]').fill('바람에 흔들리는 대나무 소리와 싱그러운 봄 향기');
    await page.getByRole('button', { name: '순간 저장' }).click();

    // Verify moment is saved in timeline
    await expect(page.getByText('교토 아라시야마')).toBeVisible();
    await expect(page.getByText('바람에 흔들리는 대나무 소리와 싱그러운 봄 향기')).toBeVisible();

    // 5. Navigate to Album page to verify 3D Book viewer
    await page.goto('http://localhost:3000/album');
    await expect(page.getByRole('button', { name: '다음 페이지' })).toBeVisible();
    await expect(page.getByText('교토 아라시야마에서의 기록')).toBeVisible();
  });
});
