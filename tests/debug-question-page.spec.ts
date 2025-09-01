import { test } from '@playwright/test';

test.describe('질문 작성 페이지 디버깅', () => {
  test('데모 로그인 후 질문 작성 페이지 상태 확인', async ({ page }) => {
    console.log('🔍 디버깅 테스트 시작');
    
    // 1. 로그인 페이지 접근
    await page.goto('/auth/login');
    console.log('1. 로그인 페이지 접근 완료');
    
    // 2. 데모 로그인
    await page.locator('button:has-text("데모로 로그인")').click();
    await page.waitForURL('/questions', { timeout: 15000 });
    console.log('2. 데모 로그인 및 리다이렉트 완료');
    
    // 3. 현재 URL과 페이지 내용 확인
    console.log('현재 URL:', page.url());
    const pageTitle = await page.title();
    console.log('페이지 타이틀:', pageTitle);
    
    // 4. 로그인 상태 확인
    const sessionInfo = await page.evaluate(() => {
      return {
        localStorage: localStorage.getItem('next-auth.session-token'),
        cookies: document.cookie
      };
    });
    console.log('세션 정보:', sessionInfo);
    
    // 5. 질문 작성 페이지로 직접 이동
    console.log('5. 질문 작성 페이지로 이동...');
    await page.goto('/questions/new');
    
    // 페이지 로드 대기
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 6. 현재 페이지 정보 확인
    console.log('질문 작성 페이지 URL:', page.url());
    const newPageTitle = await page.title();
    console.log('질문 작성 페이지 타이틀:', newPageTitle);
    
    // 7. 페이지의 모든 h1, h2 태그 확인
    const headings = await page.locator('h1, h2').all();
    console.log('페이지의 헤딩 수:', headings.length);
    
    for (let i = 0; i < headings.length; i++) {
      const text = await headings[i].textContent();
      console.log(`헤딩 ${i + 1}:`, text);
    }
    
    // 8. 페이지에 "로그인"이라는 텍스트가 있는지 확인
    const hasLoginText = await page.locator('text=로그인').count();
    console.log('로그인 텍스트 개수:', hasLoginText);
    
    if (hasLoginText > 0) {
      console.log('❌ 로그인 페이지로 리다이렉트됨 - 세션이 유지되지 않음');
    } else {
      console.log('✅ 질문 작성 페이지 정상 접근');
    }
    
    // 9. 폼 요소들 확인
    const titleInput = page.locator('#title');
    const contentTextarea = page.locator('#content');
    
    const titleExists = await titleInput.count();
    const contentExists = await contentTextarea.count();
    
    console.log('제목 입력 필드 존재:', titleExists > 0);
    console.log('내용 입력 필드 존재:', contentExists > 0);
    
    // 10. 페이지 스크린샷 저장
    await page.screenshot({ path: 'debug-question-page.png', fullPage: true });
    console.log('스크린샷 저장 완료: debug-question-page.png');
  });
});
