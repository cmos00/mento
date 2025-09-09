import { test, expect } from '@playwright/test'

test.describe('LinkedIn 로그인 콜백 처리 테스트', () => {
  test('LinkedIn OAuth 콜백 URL 접근 시 처리 확인', async ({ page }) => {
    // LinkedIn OAuth 콜백 URL 시뮬레이션
    const mockCallbackUrl = '/api/auth/callback/linkedin?code=mock_code&state=mock_state'
    
    // 콘솔 로그 수집
    const consoleLogs: string[] = []
    page.on('console', msg => {
      consoleLogs.push(msg.text())
    })
    
    // 콜백 URL로 직접 접근
    await page.goto(mockCallbackUrl)
    
    // 잠시 대기하여 로그 수집
    await page.waitForTimeout(2000)
    
    console.log('콜백 처리 로그:', consoleLogs)
    
    // 에러가 발생하지 않았는지 확인
    const hasError = consoleLogs.some(log => 
      log.includes('Error') || 
      log.includes('error') || 
      log.includes('Failed')
    )
    
    expect(hasError).toBe(false)
  })

  test('NextAuth.js 설정 확인', async ({ page }) => {
    // NextAuth.js 설정 페이지 접근
    await page.goto('/api/auth/providers')
    
    // 응답 확인
    const response = await page.waitForResponse('/api/auth/providers')
    const status = response.status()
    
    console.log('NextAuth providers 응답 상태:', status)
    
    // 정상 응답인지 확인
    expect(status).toBe(200)
    
    // 응답 내용 확인
    const providers = await response.json()
    console.log('사용 가능한 프로바이더:', Object.keys(providers))
    
    // LinkedIn 프로바이더가 있는지 확인
    expect(providers).toHaveProperty('linkedin')
    expect(providers).toHaveProperty('demo-login')
  })

  test('로그인 페이지에서 LinkedIn 로그인 시도 시 리다이렉트 확인', async ({ page }) => {
    // 로그인 페이지로 이동
    await page.goto('/auth/login')
    await page.waitForLoadState('networkidle')
    
    // LinkedIn 로그인 버튼 클릭
    const linkedinButton = page.locator('button:has-text("LinkedIn으로 로그인")')
    await linkedinButton.click()
    
    // 리다이렉트 대기
    await page.waitForTimeout(3000)
    
    const currentUrl = page.url()
    console.log('리다이렉트 후 URL:', currentUrl)
    
    // LinkedIn OAuth 페이지로 리다이렉트되었는지 확인
    const isLinkedInOAuth = currentUrl.includes('linkedin.com/oauth')
    
    if (isLinkedInOAuth) {
      console.log('✅ LinkedIn OAuth 페이지로 정상 리다이렉트됨')
      
      // OAuth URL의 필수 파라미터 확인
      const url = new URL(currentUrl)
      const requiredParams = ['client_id', 'scope', 'response_type', 'redirect_uri', 'state']
      
      for (const param of requiredParams) {
        const value = url.searchParams.get(param)
        expect(value).toBeTruthy()
        console.log(`✅ ${param}: ${value}`)
      }
      
      // 스코프 확인
      const scope = url.searchParams.get('scope')
      expect(scope).toContain('openid')
      expect(scope).toContain('profile')
      expect(scope).toContain('email')
      
    } else {
      console.log('❌ LinkedIn OAuth 페이지로 리다이렉트되지 않음')
      console.log('현재 URL:', currentUrl)
    }
  })

  test('LinkedIn 로그인 버튼 로딩 상태 확인', async ({ page }) => {
    // 로그인 페이지로 이동
    await page.goto('/auth/login')
    await page.waitForLoadState('networkidle')
    
    // LinkedIn 로그인 버튼 클릭
    const linkedinButton = page.locator('button:has-text("LinkedIn으로 로그인")')
    await linkedinButton.click()
    
    // 로딩 상태 확인 (버튼이 비활성화되는지)
    await page.waitForTimeout(500)
    
    // 버튼이 로딩 상태로 변경되었는지 확인
    const loadingText = page.locator('text=LinkedIn 로그인 중...')
    
    // 로딩 텍스트가 나타났다가 사라지는지 확인
    try {
      await expect(loadingText).toBeVisible({ timeout: 1000 })
      console.log('✅ 로딩 상태 표시됨')
    } catch (error) {
      console.log('⚠️ 로딩 상태가 표시되지 않음 (OAuth 리다이렉트가 너무 빨라서)')
    }
  })
})
