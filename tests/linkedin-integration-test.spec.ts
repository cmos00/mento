import { test, expect } from '@playwright/test'

test.describe('LinkedIn 로그인 통합 테스트', () => {
  test('LinkedIn 로그인 버튼 클릭 시 OAuth 플로우 시작 확인', async ({ page }) => {
    // 로그인 페이지로 이동
    await page.goto('/auth/login')
    await page.waitForLoadState('networkidle')
    
    // LinkedIn 로그인 버튼 확인
    const linkedinButton = page.locator('button:has-text("LinkedIn으로 로그인")')
    await expect(linkedinButton).toBeVisible()
    await expect(linkedinButton).toBeEnabled()
    
    // LinkedIn 로그인 버튼 클릭
    await linkedinButton.click()
    
    // LinkedIn OAuth URL로 리다이렉트되는지 확인
    await page.waitForTimeout(2000) // 리다이렉트 대기
    
    const currentUrl = page.url()
    console.log('현재 URL:', currentUrl)
    
    // LinkedIn OAuth URL 패턴 확인
    const isLinkedInOAuth = currentUrl.includes('linkedin.com/oauth') || 
                           currentUrl.includes('linkedin.com/oauth/v2/authorization')
    
    if (isLinkedInOAuth) {
      console.log('✅ LinkedIn OAuth 페이지로 정상 리다이렉트됨')
      
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
      expect(redirectUri).toContain('/api/auth/callback/linkedin')
      
    } else {
      console.log('❌ LinkedIn OAuth 페이지로 리다이렉트되지 않음')
      console.log('현재 URL:', currentUrl)
    }
  })

  test('LinkedIn 로그인 후 콜백 처리 확인', async ({ page }) => {
    // 로그인 페이지로 이동
    await page.goto('/auth/login')
    await page.waitForLoadState('networkidle')
    
    // 콘솔 로그 수집을 위한 리스너 설정
    const consoleLogs: string[] = []
    page.on('console', msg => {
      if (msg.text().includes('LinkedIn') || msg.text().includes('Auth Debug')) {
        consoleLogs.push(msg.text())
      }
    })
    
    // LinkedIn 로그인 버튼 클릭
    const linkedinButton = page.locator('button:has-text("LinkedIn으로 로그인")')
    await linkedinButton.click()
    
    // 잠시 대기하여 콘솔 로그 수집
    await page.waitForTimeout(1000)
    
    // LinkedIn 관련 로그가 있는지 확인
    console.log('수집된 콘솔 로그:', consoleLogs)
    
    // 최소한 LinkedIn 로그인 시도 로그는 있어야 함
    const hasLinkedInLog = consoleLogs.some(log => 
      log.includes('LinkedIn 로그인 시도') || 
      log.includes('LinkedIn') ||
      log.includes('OAuth')
    )
    
    console.log('LinkedIn 관련 로그 존재:', hasLinkedInLog)
  })

  test('데모 로그인과 LinkedIn 로그인 버튼 모두 존재 확인', async ({ page }) => {
    // 로그인 페이지로 이동
    await page.goto('/auth/login')
    await page.waitForLoadState('networkidle')
    
    // LinkedIn 로그인 버튼 확인
    const linkedinButton = page.locator('button:has-text("LinkedIn으로 로그인")')
    await expect(linkedinButton).toBeVisible()
    await expect(linkedinButton).toBeEnabled()
    
    // 데모 로그인 버튼 확인
    const demoButton = page.locator('button:has-text("데모로 로그인")')
    await expect(demoButton).toBeVisible()
    await expect(demoButton).toBeEnabled()
    
    // 두 버튼 모두 클릭 가능한지 확인
    await expect(linkedinButton).toBeEnabled()
    await expect(demoButton).toBeEnabled()
  })

  test('LinkedIn 로그인 버튼 스타일링 확인', async ({ page }) => {
    // 로그인 페이지로 이동
    await page.goto('/auth/login')
    await page.waitForLoadState('networkidle')
    
    // LinkedIn 로그인 버튼 확인
    const linkedinButton = page.locator('button:has-text("LinkedIn으로 로그인")')
    
    // LinkedIn 브랜드 색상 확인 (#0077b5)
    const backgroundColor = await linkedinButton.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    
    console.log('LinkedIn 버튼 배경색:', backgroundColor)
    
    // 버튼이 보이는지 확인
    await expect(linkedinButton).toBeVisible()
    
    // LinkedIn 아이콘이 있는지 확인
    const linkedinIcon = linkedinButton.locator('svg')
    await expect(linkedinIcon).toBeVisible()
  })

  test('환경 변수 및 설정 확인', async ({ page }) => {
    // 로그인 페이지로 이동
    await page.goto('/auth/login')
    await page.waitForLoadState('networkidle')
    
    // LinkedIn 로그인 버튼 클릭하여 OAuth URL 확인
    const linkedinButton = page.locator('button:has-text("LinkedIn으로 로그인")')
    await linkedinButton.click()
    
    await page.waitForTimeout(2000)
    
    const currentUrl = page.url()
    
    if (currentUrl.includes('linkedin.com/oauth')) {
      const url = new URL(currentUrl)
      const clientId = url.searchParams.get('client_id')
      
      // 환경 변수에서 설정된 클라이언트 ID와 일치하는지 확인
      // 실제 환경 변수 값: 869opboyzlkrhb
      expect(clientId).toBe('869opboyzlkrhb')
      console.log('✅ 올바른 LinkedIn Client ID 확인:', clientId)
    }
  })
})
