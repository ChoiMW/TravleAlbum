import { test, expect } from '@playwright/test';

test.describe('Demo Albums Verification', () => {
  test('CoverEditor and RecordDashboard demo loading works for all 3 templates', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // 1. Check Demo selector in CoverEditor
    const jejuBtn = page.getByRole('button', { name: /제주 감성 힐링 여행/ });
    const europeBtn = page.getByRole('button', { name: /유럽 낭만 배낭여행/ });
    const danangBtn = page.getByRole('button', { name: /다낭 가족 힐링 휴양/ });

    await expect(jejuBtn).toBeVisible();
    await expect(europeBtn).toBeVisible();
    await expect(danangBtn).toBeVisible();

    // 2. Load Jeju (Minimal)
    await jejuBtn.click();
    await expect(page.getByRole('heading', { name: 'JEJU SLOW & BREEZE' })).toBeVisible();
    await expect(page.getByText('Jeju · Aewol · Hyeopjae')).toBeVisible();

    // Navigate to Record page
    await page.goto('http://localhost:3000/record');
    await expect(page.getByText('협재 해변')).toBeVisible();
    await expect(page.getByText('애월 돌담길 북카페')).toBeVisible();
    await expect(page.getByText('비자림 숲길 (천년의 숲)')).toBeVisible();

    // 3. Load Europe (Magazine) from Record page
    const europeRecordBtn = page.getByRole('button', { name: /유럽여행/ });
    await europeRecordBtn.click();
    await expect(page.getByText('파리 루브르 & 튈르리')).toBeVisible();
    await expect(page.getByText('로마 콜로세움')).toBeVisible();

    // 4. Load Da Nang (Diary) from Record page
    const danangRecordBtn = page.getByRole('button', { name: /다낭 가족/ });
    await danangRecordBtn.click();
    await expect(page.getByText('미케비치 오션뷰 리조트')).toBeVisible();
    await expect(page.getByText('호이안 올드타운 투본강')).toBeVisible();

    // 5. Navigate to Album page to verify 3D Book viewer rendering
    await page.goto('http://localhost:3000/album');
    await expect(page.getByText('DANANG FAMILY VACATION').first()).toBeVisible();
    await expect(page.getByText('온 가족이 함께 웃고 쉬어간 다낭의 푸른 날들').first()).toBeVisible();
  });
});
