import { expect, test } from '@playwright/test'

test.describe('데모 로그인 전체 플로우 테스트', () => {
  test('1. 데모 로그인 성공 처리', async ({ page }) => {
    console.log('🚀 데모 로그인 성공 테스트 시작')
    
    // 1. 로그인 페이지 접근
    await page.goto('/auth/login')
    console.log('✅ 1. 로그인 페이지 접근 완료')
    
    // 2. 데모 로그인 버튼 클릭
    const demoButton = page.locator('text=데모로 로그인')
    await expect(demoButton).toBeVisible()
    await demoButton.click()
    console.log('✅ 2. 데모 로그인 완료')
    
    // 3. 로그인 후 질문 목록 페이지로 이동 확인
    await page.waitForURL('/questions')
    console.log('✅ 3. 질문 목록 페이지로 이동 완료')
    
    // 로그인 상태 확인 - 질문 작성 버튼이 보여야 함 (더 구체적인 선택자 사용)
    const createButton = page.getByRole('button', { name: '질문 작성' }).first()
    await expect(createButton).toBeVisible()
    console.log('✅ 데모 로그인 성공: 질문 작성 버튼 표시됨')
    
    // 스크린샷 저장
    await page.screenshot({ path: 'demo-login-success.png' })
  })

  test('2. 데모 로그인 후 질문 작성 페이지 접근', async ({ page }) => {
    console.log('🚀 질문 작성 페이지 접근 테스트 시작')
    
    // 1. 로그인 페이지 접근
    await page.goto('/auth/login')
    console.log('✅ 1. 로그인 페이지 접근 완료')
    
    // 2. 데모 로그인
    const demoButton = page.locator('text=데모로 로그인')
    await demoButton.click()
    console.log('✅ 2. 데모 로그인 완료')
    
    // 3. 질문 목록 페이지에서 질문 작성 버튼 클릭
    await page.waitForURL('/questions')
    const createButton = page.getByRole('button', { name: '질문 작성' }).first()
    await createButton.click()
    console.log('✅ 3. 질문 작성 버튼 클릭 완료')
    
    // 4. 질문 작성 페이지 접근 확인
    await page.waitForURL('/questions/new')
    await page.waitForLoadState('networkidle')
    console.log('✅ 4. 질문 작성 페이지 접근 완료')
    
    // 질문 작성 폼 요소 확인 (실제 페이지의 제목 사용)
    await expect(page.locator('text=새 질문 작성')).toBeVisible()
    console.log('✅ 5. 페이지 제목 확인 완료')
    
    // 폼 필드들 확인 (실제 ID 사용, 가시성 대기 추가)
    const titleInput = page.locator('#title')
    const contentTextarea = page.locator('#content')
    const categorySelect = page.locator('#category')
    
    await expect(titleInput).toBeVisible()
    await expect(contentTextarea).toBeVisible()
    await expect(categorySelect).toBeVisible()
    console.log('✅ 6. 폼 필드들 확인 완료')
    
    // 스크린샷 저장
    await page.screenshot({ path: 'question-form-page.png' })
  })

  test('3. 데모 로그인 상태에서 질문 작성 및 등록', async ({ page }) => {
    console.log('🚀 질문 작성 및 등록 테스트 시작')
    
    try {
      // 1. 로그인 페이지 접근
      await page.goto('/auth/login')
      console.log('✅ 1. 로그인 페이지 접근 완료')
      
      // 2. 데모 로그인
      const demoButton = page.locator('text=데모로 로그인')
      await demoButton.click()
      console.log('✅ 2. 데모 로그인 완료')
      
      // 3. 질문 작성 페이지로 직접 이동 (더 강화된 대기)
      await page.goto('/questions/new')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000) // 추가 대기
      console.log('✅ 3. 질문 작성 페이지 접근 완료')
      
      // 4. 질문 내용 입력 (요소 가시성 확인 후 입력)
      const testTitle = '테스트 질문 제목입니다'
      const testContent = '이것은 테스트 질문 내용입니다. 커리어 고민에 대한 조언을 구합니다.'
      
      const titleInput = page.locator('#title')
      const contentTextarea = page.locator('#content')
      
      // 요소가 완전히 로드될 때까지 대기 (더 긴 타임아웃)
      await expect(titleInput).toBeVisible({ timeout: 15000 })
      await expect(contentTextarea).toBeVisible({ timeout: 15000 })
      
      await titleInput.fill(testTitle)
      await contentTextarea.fill(testContent)
      console.log('✅ 4. 질문 내용 입력 완료')
      
      // 카테고리 선택 (있는 경우, 실제 옵션 값 사용)
      const categorySelect = page.locator('#category')
      if (await categorySelect.isVisible()) {
        // 실제 옵션 값으로 선택
        await categorySelect.selectOption('기타')
        console.log('✅ 5. 카테고리 선택 완료')
      }
      
      // 5. 질문 등록 버튼 클릭
      const submitButton = page.locator('text=질문 등록하기')
      await expect(submitButton).toBeVisible()
      await submitButton.click()
      console.log('✅ 6. 질문 등록 버튼 클릭 완료')
      
      // 6. 등록 후 리다이렉트 확인 (더 긴 타임아웃)
      await page.waitForURL('/questions', { timeout: 15000 })
      console.log('✅ 7. 질문 목록 페이지로 리다이렉트 완료')
      
      // 등록된 질문이 목록에 표시되는지 확인
      const questionTitle = page.locator(`text=${testTitle}`)
      await expect(questionTitle).toBeVisible({ timeout: 15000 })
      console.log('✅ 8. 등록된 질문 확인 완료')
      
      console.log('질문 등록 후 현재 URL:', page.url())
      console.log('✅ 데모 로그인 상태에서 질문 작성 및 등록 테스트 완료')
      
    } catch (error) {
      console.error('테스트 실패:', error)
      // 실패 시 스크린샷 저장
      await page.screenshot({ path: 'test-failure.png' })
      throw error
    }
  })

  test('4. 전체 플로우 통합 테스트', async ({ page }) => {
    console.log('🔄 전체 플로우 통합 테스트 시작')
    
    try {
      // 1단계: 로그인 페이지 접근
      await page.goto('/auth/login')
      console.log('✅ 1단계: 로그인 페이지 접근 완료')
      
      // 2단계: 데모 로그인
      const demoButton = page.locator('text=데모로 로그인')
      await demoButton.click()
      console.log('✅ 2단계: 데모 로그인 완료')
      
      // 3단계: 질문 목록 페이지 로드
      await page.waitForURL('/questions')
      console.log('✅ 3단계: 질문 목록 페이지 로드 완료')
      
      // 4단계: 질문 작성 페이지 접근
      await page.goto('/questions/new')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000) // 추가 대기
      console.log('✅ 4단계: 질문 작성 페이지 접근 완료')
      
      // 5단계: 질문 작성 (요소 가시성 확인 후 입력)
      const testTitle = '통합 테스트 질문'
      const testContent = '전체 플로우를 테스트하기 위한 질문입니다.'
      
      const titleInput = page.locator('#title')
      const contentTextarea = page.locator('#content')
      
      await expect(titleInput).toBeVisible({ timeout: 15000 })
      await expect(contentTextarea).toBeVisible({ timeout: 15000 })
      
      await titleInput.fill(testTitle)
      await contentTextarea.fill(testContent)
      console.log('✅ 5단계: 질문 내용 입력 완료')
      
      // 6단계: 질문 등록
      const submitButton = page.locator('text=질문 등록하기')
      await expect(submitButton).toBeVisible()
      await submitButton.click()
      console.log('✅ 6단계: 질문 등록 버튼 클릭 완료')
      
      // 7단계: 프로필 페이지 접근
      await page.goto('/profile')
      console.log('✅ 7단계: 프로필 페이지 접근 완료')
      
      // 8단계: 로그아웃 (있는 경우에만)
      const logoutButton = page.locator('text=로그아웃')
      if (await logoutButton.isVisible()) {
        await logoutButton.click()
        console.log('✅ 8단계: 로그아웃 완료')
      }
      
      console.log('🎉 전체 플로우 통합 테스트 성공적으로 완료!')
      
    } catch (error) {
      console.error('테스트 실패:', error)
      // 실패 시 스크린샷 저장
      await page.screenshot({ path: 'integration-test-failure.png' })
      throw error
    }
  })
})
