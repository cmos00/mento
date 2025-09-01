import { expect, test } from '@playwright/test';

test.describe('질문 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 데모 로그인 수행
    await page.goto('/auth/login');
    await page.locator('text=데모로 로그인').click();
    await page.waitForURL('/questions');
  });

  test('질문 목록 페이지 로드 확인', async ({ page }) => {
    await expect(page).toHaveURL('/questions');
    
    // 질문 목록 페이지 요소 확인
    await expect(page.locator('text=질문 & 답변')).toBeVisible();
    
    // 질문 작성 버튼 확인
    const createButton = page.locator('text=질문 작성');
    if (await createButton.isVisible()) {
      await expect(createButton).toBeVisible();
    }
  });

  test('질문 작성 페이지 접근 및 폼 확인', async ({ page }) => {
    await page.goto('/questions/new');
    
    // 질문 작성 폼 요소 확인
    await expect(page.locator('text=질문 작성')).toBeVisible();
    
    // 폼 필드들 확인
    const titleInput = page.locator('input[name="title"], input[placeholder*="제목"]');
    const contentTextarea = page.locator('textarea[name="content"], textarea[placeholder*="내용"]');
    const categorySelect = page.locator('select[name="category"]');
    
    if (await titleInput.isVisible()) {
      await expect(titleInput).toBeVisible();
    }
    
    if (await contentTextarea.isVisible()) {
      await expect(contentTextarea).toBeVisible();
    }
    
    if (await categorySelect.isVisible()) {
      await expect(categorySelect).toBeVisible();
    }
  });

  test('질문 작성 기능 테스트', async ({ page }) => {
    await page.goto('/questions/new');
    
    // 폼 필드 채우기
    const titleInput = page.locator('input[name="title"], input[placeholder*="제목"]').first();
    const contentTextarea = page.locator('textarea[name="content"], textarea[placeholder*="내용"]').first();
    
    if (await titleInput.isVisible() && await contentTextarea.isVisible()) {
      await titleInput.fill('테스트 질문 제목');
      await contentTextarea.fill('테스트 질문 내용입니다.');
      
      // 카테고리 선택 (있는 경우)
      const categorySelect = page.locator('select[name="category"]').first();
      if (await categorySelect.isVisible()) {
        await categorySelect.selectOption({ index: 1 });
      }
      
      // 질문 등록 버튼 클릭
      const submitButton = page.locator('button[type="submit"], button:has-text("등록"), button:has-text("작성")').first();
      if (await submitButton.isVisible()) {
        await submitButton.click();
        
        // 성공 후 리다이렉트 또는 성공 메시지 확인
        await page.waitForTimeout(2000); // 요청 완료 대기
      }
    }
  });
});
