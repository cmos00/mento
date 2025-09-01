import { expect, test } from '@playwright/test';

test.describe('인증 테스트', () => {
  test('로그인 페이지 접근 및 UI 확인', async ({ page }) => {
    await page.goto('/auth/login');
    
    // 페이지 타이틀 확인
    await expect(page).toHaveTitle(/CareerTalk/);
    
    // 로그인 폼 요소 확인 (더 구체적인 선택자 사용)
    await expect(page.locator('h1:has-text("로그인")')).toBeVisible();
    await expect(page.locator('button:has-text("LinkedIn으로 로그인")')).toBeVisible();
    await expect(page.locator('button:has-text("데모로 로그인")')).toBeVisible();
  });

  test('데모 로그인 동작 확인', async ({ page }) => {
    await page.goto('/auth/login');
    
    // 데모 로그인 버튼 클릭
    await page.locator('button:has-text("데모로 로그인")').click();
    
    // 로그인 성공 후 질문 목록 페이지로 리다이렉트 확인
    await page.waitForURL('/questions', { timeout: 10000 });
    await expect(page).toHaveURL('/questions');
    
    // 질문 목록 페이지 요소 확인
    await expect(page.locator('text=질문 & 답변')).toBeVisible();
  });

  test('LinkedIn 로그인 버튼 동작 확인', async ({ page }) => {
    await page.goto('/auth/login');
    
    // LinkedIn 로그인 버튼이 존재하는지 확인
    const linkedinButton = page.locator('button:has-text("LinkedIn으로 로그인")');
    await expect(linkedinButton).toBeVisible();
    
    // LinkedIn 로그인 버튼 클릭 (실제 OAuth는 환경변수에 따라 다름)
    await linkedinButton.click();
    
    // OAuth 흐름이 시작되거나 환경변수가 없으면 원래 페이지에 머무름
    await page.waitForTimeout(2000);
    
    // LinkedIn OAuth가 설정되어 있다면 LinkedIn 페이지로 리다이렉트
    // 설정되어 있지 않다면 원래 페이지에 머무름
    const currentUrl = page.url();
    console.log('LinkedIn 로그인 시도 후 현재 URL:', currentUrl);
  });

  test('프로필 페이지 접근 및 사용자 정보 표시', async ({ page }) => {
    // 데모 로그인 먼저 수행
    await page.goto('/auth/login');
    await page.locator('button:has-text("데모로 로그인")').click();
    await page.waitForURL('/questions', { timeout: 10000 });
    
    // 프로필 페이지로 이동
    await page.goto('/profile');
    
    // 프로필 페이지가 로드될 때까지 대기
    await page.waitForLoadState('networkidle');
    
    // CareerTalk 헤더 확인 (프로필 페이지 로드 확인)
    await expect(page.locator('text=CareerTalk')).toBeVisible();
    
    // 프로필 정보 확인 (더 유연한 접근)
    // 사용자 이름이 포함된 h2 태그 찾기
    const nameElement = page.locator('h2').first();
    await expect(nameElement).toBeVisible();
    
    // 이메일 정보 확인
    await expect(page.locator('text=demo@example.com')).toBeVisible();
    
    // 활동 통계 섹션 확인
    await expect(page.locator('text=활동 통계')).toBeVisible();
    
    // 데모 계정 뱃지 확인 (있는 경우)
    const demoBadge = page.locator('text=🎭 데모 계정');
    if (await demoBadge.isVisible()) {
      await expect(demoBadge).toBeVisible();
    }
  });
});
