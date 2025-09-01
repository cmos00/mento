import { test } from '@playwright/test';

test.describe('세션 디버깅', () => {
  test('데모 로그인 후 세션 상태 상세 확인', async ({ page }) => {
    console.log('🔍 세션 디버깅 시작');
    
    // 1. 로그인 페이지 접근
    await page.goto('/auth/login');
    console.log('1. 로그인 페이지 접근');
    
    // 2. 로그인 전 쿠키 확인
    const cookiesBefore = await page.context().cookies();
    console.log('로그인 전 쿠키:', cookiesBefore.map(c => c.name));
    
    // 3. 데모 로그인
    console.log('3. 데모 로그인 시작...');
    await page.locator('button:has-text("데모로 로그인")').click();
    
    // 4. 리다이렉트 완료 대기
    await page.waitForURL('/questions', { timeout: 15000 });
    console.log('4. 질문 목록 페이지로 리다이렉트 완료');
    
    // 5. 로그인 후 쿠키 확인
    const cookiesAfter = await page.context().cookies();
    console.log('로그인 후 쿠키:');
    cookiesAfter.forEach(cookie => {
      console.log(`- ${cookie.name}: ${cookie.value?.substring(0, 50)}...`);
    });
    
    // 6. NextAuth 관련 쿠키 확인
    const nextAuthCookies = cookiesAfter.filter(c => c.name.includes('next-auth'));
    console.log('NextAuth 쿠키 개수:', nextAuthCookies.length);
    
    // 7. API 세션 엔드포인트 직접 호출
    console.log('7. API 세션 엔드포인트 호출...');
    const sessionResponse = await page.request.get('/api/auth/session');
    const sessionData = await sessionResponse.json();
    console.log('세션 API 응답:', JSON.stringify(sessionData, null, 2));
    
    // 8. 잠시 대기 후 다시 확인
    await page.waitForTimeout(2000);
    
    // 9. 다시 질문 작성 페이지 이동 시도
    console.log('9. 질문 작성 페이지 이동 시도...');
    await page.goto('/questions/new');
    await page.waitForLoadState('networkidle');
    
    // 10. 현재 페이지 상태 확인
    const currentUrl = page.url();
    const hasLoginText = await page.locator('text=로그인이 필요합니다').count();
    
    console.log('최종 URL:', currentUrl);
    console.log('로그인 필요 메시지 존재:', hasLoginText > 0);
    
    if (hasLoginText > 0) {
      console.log('❌ 여전히 로그인이 필요함 - 세션 문제 확인됨');
      
      // 다시 세션 API 호출
      const retrySessionResponse = await page.request.get('/api/auth/session');
      const retrySessionData = await retrySessionResponse.json();
      console.log('재시도 세션 API 응답:', JSON.stringify(retrySessionData, null, 2));
    } else {
      console.log('✅ 세션이 유지됨 - 정상 동작');
    }
  });

  test('세션 API 직접 테스트', async ({ page }) => {
    // 데모 로그인
    await page.goto('/auth/login');
    await page.locator('button:has-text("데모로 로그인")').click();
    await page.waitForURL('/questions', { timeout: 15000 });
    
    // 여러 번 세션 API 호출하여 안정성 확인
    for (let i = 1; i <= 3; i++) {
      console.log(`${i}번째 세션 API 호출`);
      const response = await page.request.get('/api/auth/session');
      const data = await response.json();
      console.log(`응답 ${i}:`, data);
      await page.waitForTimeout(1000);
    }
  });
});
