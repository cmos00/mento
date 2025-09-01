import { expect, test } from '@playwright/test';

test.describe('간단한 데모 로그인 테스트', () => {
  test('데모 로그인 기본 동작', async ({ page }) => {
    console.log('🚀 간단한 데모 로그인 테스트 시작');
    
    // 1. 로그인 페이지 접근
    await page.goto('/auth/login');
    console.log('✅ 1. 로그인 페이지 접근 완료');
    
    // 2. 페이지 제목 확인
    const title = await page.title();
    console.log('📄 페이지 제목:', title);
    
    // 3. 데모 로그인 버튼 확인
    const demoButton = page.locator('button:has-text("데모로 로그인")');
    await expect(demoButton).toBeVisible();
    console.log('✅ 2. 데모 로그인 버튼 확인 완료');
    
    // 4. 데모 로그인 버튼 클릭
    console.log('🖱️ 데모 로그인 버튼 클릭...');
    await demoButton.click();
    
    // 5. 잠시 대기
    await page.waitForTimeout(3000);
    
    // 6. 현재 URL 확인
    const currentUrl = page.url();
    console.log('🔗 현재 URL:', currentUrl);
    
    // 7. 페이지 내용 확인
    const pageContent = await page.content();
    const hasQuestionsText = pageContent.includes('질문') || pageContent.includes('Questions');
    const hasLoginText = pageContent.includes('로그인') || pageContent.includes('Login');
    
    console.log('📋 페이지에 "질문" 텍스트 포함:', hasQuestionsText);
    console.log('📋 페이지에 "로그인" 텍스트 포함:', hasLoginText);
    
    if (currentUrl.includes('/questions')) {
      console.log('🎉 성공: 질문 목록 페이지로 이동됨!');
    } else if (hasQuestionsText) {
      console.log('🎉 성공: 질문 관련 내용이 표시됨!');
    } else if (hasLoginText) {
      console.log('❌ 실패: 여전히 로그인 페이지에 머무름');
    } else {
      console.log('❓ 알 수 없음: 예상과 다른 페이지');
    }
    
    // 8. 스크린샷 저장
    await page.screenshot({ path: 'simple-demo-login-result.png', fullPage: true });
    console.log('📸 스크린샷 저장 완료: simple-demo-login-result.png');
  });
});
