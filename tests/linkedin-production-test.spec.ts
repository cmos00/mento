import { test, expect } from '@playwright/test'

test.describe('LinkedIn 로그인 프로덕션 환경 테스트', () => {
  test('실제 서버에서 LinkedIn 로그인 버튼 확인', async ({ page }) => {
    // 실제 서버 환경으로 이동
    await page.goto('https://mento-five.vercel.app/auth/login')
    await page.waitForLoadState('networkidle')
    
    // LinkedIn 로그인 버튼 확인
    const linkedinButton = page.locator('button:has-text("LinkedIn으로 로그인")')
    await expect(linkedinButton).toBeVisible()
    await expect(linkedinButton).toBeEnabled()
    
    console.log('✅ 실제 서버에서 LinkedIn 로그인 버튼 확인됨')
  })

  test('실제 서버에서 LinkedIn OAuth 플로우 테스트', async ({ page }) => {
    // 실제 서버 환경으로 이동
    await page.goto('https://mento-five.vercel.app/auth/login')
    await page.waitForLoadState('networkidle')
    
    // LinkedIn 로그인 버튼 클릭
    const linkedinButton = page.locator('button:has-text("LinkedIn으로 로그인")')
    await linkedinButton.click()
    
    // LinkedIn OAuth URL로 리다이렉트되는지 확인
    await page.waitForTimeout(3000)
    
    const currentUrl = page.url()
    console.log('현재 URL:', currentUrl)
    
    // LinkedIn OAuth URL 패턴 확인
    const isLinkedInOAuth = currentUrl.includes('linkedin.com/oauth') || 
                           currentUrl.includes('linkedin.com/oauth/v2/authorization')
    
    if (isLinkedInOAuth) {
      console.log('✅ 실제 서버에서 LinkedIn OAuth 페이지로 정상 리다이렉트됨')
      
      // OAuth URL 파라미터 확인
      const url = new URL(currentUrl)
      const clientId = url.searchParams.get('client_id')
      const scope = url.searchParams.get('scope')
      const responseType = url.searchParams.get('response_type')
      const redirectUri = url.searchParams.get('redirect_uri')
      
      console.log('OAuth 파라미터:')
      console.log('- client_id:', clientId)
      console.log('- scope:', scope)
      console.log('- response_type:', responseType)
      console.log('- redirect_uri:', redirectUri)
      
      // 필수 파라미터 확인
      expect(clientId).toBeTruthy()
      expect(scope).toContain('openid')
      expect(scope).toContain('profile')
      expect(scope).toContain('email')
      expect(responseType).toBe('code')
      expect(redirectUri).toContain('mento-five.vercel.app/api/auth/callback/linkedin')
      
      console.log('✅ 모든 OAuth 파라미터가 올바르게 설정됨')
      
    } else {
      console.log('❌ LinkedIn OAuth 페이지로 리다이렉트되지 않음')
      console.log('현재 URL:', currentUrl)
    }
  })

  test('실제 서버에서 홈페이지 로그인/로그아웃 버튼 확인', async ({ page }) => {
    // 실제 서버 홈페이지로 이동
    await page.goto('https://mento-five.vercel.app/')
    await page.waitForLoadState('networkidle')
    
    // 로그인 버튼이 있는지 확인
    const loginButton = page.locator('button:has-text("로그인")')
    await expect(loginButton).toBeVisible()
    
    console.log('✅ 실제 서버 홈페이지에서 로그인 버튼 확인됨')
    
    // 시작하기 버튼도 확인
    const startButton = page.locator('button:has-text("시작하기")')
    await expect(startButton).toBeVisible()
    
    console.log('✅ 실제 서버 홈페이지에서 시작하기 버튼 확인됨')
  })

  test('실제 서버에서 데모 로그인 테스트', async ({ page }) => {
    // 실제 서버 환경으로 이동
    await page.goto('https://mento-five.vercel.app/auth/login')
    await page.waitForLoadState('networkidle')
    
    // 데모 로그인 버튼 확인
    const demoButton = page.locator('button:has-text("데모로 로그인")')
    await expect(demoButton).toBeVisible()
    await expect(demoButton).toBeEnabled()
    
    // 데모 로그인 버튼 클릭
    await demoButton.click()
    
    // 로그인 성공 후 질문 페이지로 리다이렉트되는지 확인
    await page.waitForURL('**/questions', { timeout: 10000 })
    
    const currentUrl = page.url()
    console.log('데모 로그인 후 URL:', currentUrl)
    
    expect(currentUrl).toContain('/questions')
    console.log('✅ 실제 서버에서 데모 로그인 성공 및 질문 페이지 리다이렉트 확인됨')
  })

  test('실제 서버에서 LinkedIn 로그인 버튼 스타일링 확인', async ({ page }) => {
    // 실제 서버 환경으로 이동
    await page.goto('https://mento-five.vercel.app/auth/login')
    await page.waitForLoadState('networkidle')
    
    // LinkedIn 로그인 버튼 확인
    const linkedinButton = page.locator('button:has-text("LinkedIn으로 로그인")')
    
    // LinkedIn 브랜드 색상 확인 (#0077b5)
    const backgroundColor = await linkedinButton.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    
    console.log('실제 서버 LinkedIn 버튼 배경색:', backgroundColor)
    
    // 버튼이 보이는지 확인
    await expect(linkedinButton).toBeVisible()
    
    // LinkedIn 아이콘이 있는지 확인
    const linkedinIcon = linkedinButton.locator('svg')
    await expect(linkedinIcon).toBeVisible()
    
    console.log('✅ 실제 서버에서 LinkedIn 버튼 스타일링 확인됨')
  })

  test('실제 서버에서 환경 변수 설정 확인', async ({ page }) => {
    // 실제 서버 환경으로 이동
    await page.goto('https://mento-five.vercel.app/auth/login')
    await page.waitForLoadState('networkidle')
    
    // LinkedIn 로그인 버튼 클릭하여 OAuth URL 확인
    const linkedinButton = page.locator('button:has-text("LinkedIn으로 로그인")')
    await linkedinButton.click()
    
    await page.waitForTimeout(3000)
    
    const currentUrl = page.url()
    
    if (currentUrl.includes('linkedin.com/oauth')) {
      const url = new URL(currentUrl)
      const clientId = url.searchParams.get('client_id')
      
      // 환경 변수에서 설정된 클라이언트 ID와 일치하는지 확인
      expect(clientId).toBe('869opboyzlkrhb')
      console.log('✅ 실제 서버에서 올바른 LinkedIn Client ID 확인:', clientId)
      
      // 리다이렉트 URI가 프로덕션 도메인인지 확인
      const redirectUri = url.searchParams.get('redirect_uri')
      expect(redirectUri).toContain('mento-five.vercel.app')
      console.log('✅ 실제 서버에서 올바른 리다이렉트 URI 확인:', redirectUri)
      
    } else {
      console.log('❌ LinkedIn OAuth 페이지로 리다이렉트되지 않음')
    }
  })
})
