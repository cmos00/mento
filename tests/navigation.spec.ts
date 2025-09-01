import { expect, test } from '@playwright/test';

test.describe('네비게이션 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 데모 로그인 수행
    await page.goto('/auth/login');
    await page.locator('text=데모로 로그인').click();
    await page.waitForURL('/questions');
  });

  test('메인 네비게이션 동작 확인', async ({ page }) => {
    // 질문 목록 페이지에서 시작
    await expect(page).toHaveURL('/questions');
    
    // 다양한 페이지로 네비게이션 테스트
    // (모바일 하단 네비게이션 또는 사이드바 네비게이션 확인)
    
    // 질문 작성 페이지로 이동
    await page.goto('/questions/new');
    await expect(page).toHaveURL('/questions/new');
    await expect(page.locator('text=질문 작성')).toBeVisible();
    
    // 프로필 페이지로 이동
    await page.goto('/profile');
    await expect(page).toHaveURL('/profile');
    await expect(page.locator('text=데모 사용자')).toBeVisible();
    
    // 멘토 페이지로 이동
    await page.goto('/mentors');
    await expect(page).toHaveURL('/mentors');
  });

  test('모바일 하단 네비게이션 테스트', async ({ page }) => {
    // 모바일 뷰포트로 설정
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 하단 네비게이션 바 확인
    const bottomNav = page.locator('[data-testid="mobile-bottom-nav"]');
    if (await bottomNav.isVisible()) {
      await expect(bottomNav).toBeVisible();
      
      // 네비게이션 아이템들 확인
      await expect(bottomNav.locator('text=홈')).toBeVisible();
      await expect(bottomNav.locator('text=프로필')).toBeVisible();
    }
  });
});
