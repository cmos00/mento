import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* 병렬 테스트 실행 */
  fullyParallel: true,
  /* CI에서 실패 시 재시도 금지 */
  forbidOnly: !!process.env.CI,
  /* CI에서 재시도 설정 */
  retries: process.env.CI ? 2 : 0,
  /* CI에서 워커 수 제한, 로컬에서는 병렬 처리 */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter 설정 */
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }]
  ],
  /* 모든 테스트에 공통 설정 */
  use: {
    /* 실패 시 스크린샷 및 비디오 수집 */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    /* Trace 수집 (디버깅용) */
    trace: 'on-first-retry',
    /* 기본 베이스 URL */
    baseURL: 'http://localhost:3000',
  },

  /* 크롬 환경에서만 테스트 실행 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* 로컬 개발 서버 시작 */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2분
  },
});
