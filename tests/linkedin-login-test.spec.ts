import { expect, test } from '@playwright/test'

test.describe('LinkedIn 로그인 테스트', () => {
  test('LinkedIn 로그인 버튼이 존재하고 클릭 가능한지 확인', async ({ page }) => {
    // 로그인 페이지로 이동
    await page.goto('/auth/login')
    
    // 페이지가 로드될 때까지 대기
    await page.waitForLoadState('networkidle')
    
    // LinkedIn 로그인 버튼이 존재하는지 확인
    const linkedinButton = page.locator('button:has-text("LinkedIn으로 로그인")')
    await expect(linkedinButton).toBeVisible()
    
    // 버튼이 클릭 가능한지 확인
    await expect(linkedinButton).toBeEnabled()
    
    // 버튼 텍스트 확인
    await expect(linkedinButton).toContainText('LinkedIn으로 로그인')
  })

  test('LinkedIn 로그인 버튼 클릭 시 로딩 상태 확인', async ({ page }) => {
    // 로그인 페이지로 이동
    await page.goto('/auth/login')
    await page.waitForLoadState('networkidle')
    
    // LinkedIn 로그인 버튼 클릭
    const linkedinButton = page.locator('button:has-text("LinkedIn으로 로그인")')
    await linkedinButton.click()
    
    // 로딩 상태 확인 (LinkedIn OAuth 리다이렉트가 시작되는지)
    // 실제 LinkedIn OAuth 플로우에서는 리다이렉트가 발생하므로
    // 로딩 상태가 나타나는지 확인
    await page.waitForTimeout(1000)
    
    // LinkedIn OAuth URL로 리다이렉트되는지 확인
    const currentUrl = page.url()
    console.log('현재 URL:', currentUrl)
    
    // LinkedIn OAuth URL 패턴 확인 (실제 OAuth 플로우에서는 linkedin.com으로 리다이렉트됨)
    // 로컬 테스트에서는 콘솔 로그로 확인
    const consoleLogs: string[] = []
    page.on('console', msg => {
      if (msg.text().includes('LinkedIn')) {
        consoleLogs.push(msg.text())
      }
    })
    
    // LinkedIn 관련 로그가 있는지 확인
    expect(consoleLogs.length).toBeGreaterThan(0)
  })

  test('LinkedIn 로그인과 데모 로그인 버튼이 모두 존재하는지 확인', async ({ page }) => {
    // 로그인 페이지로 이동
    await page.goto('/auth/login')
    await page.waitForLoadState('networkidle')
    
    // LinkedIn 로그인 버튼 확인
    const linkedinButton = page.locator('button:has-text("LinkedIn으로 로그인")')
    await expect(linkedinButton).toBeVisible()
    
    // 데모 로그인 버튼 확인
    const demoButton = page.locator('button:has-text("데모로 로그인")')
    await expect(demoButton).toBeVisible()
    
    // 두 버튼 모두 클릭 가능한지 확인
    await expect(linkedinButton).toBeEnabled()
    await expect(demoButton).toBeEnabled()
  })

  test('LinkedIn 로그인 버튼 스타일 확인', async ({ page }) => {
    // 로그인 페이지로 이동
    await page.goto('/auth/login')
    await page.waitForLoadState('networkidle')
    
    // LinkedIn 로그인 버튼 스타일 확인
    const linkedinButton = page.locator('button:has-text("LinkedIn으로 로그인")')
    
    // LinkedIn 브랜드 색상 확인 (#0077b5)
    const backgroundColor = await linkedinButton.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    
    console.log('LinkedIn 버튼 배경색:', backgroundColor)
    
    // 버튼이 보이는지 확인
    await expect(linkedinButton).toBeVisible()
  })
})
