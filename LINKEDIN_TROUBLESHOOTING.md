# LinkedIn OAuth 500 에러 해결 가이드

## 현재 에러 상황
```
Request URL: https://www.linkedin.com/oauth/v2/authorization?client_id=869opboyzlkrhb&scope=openid%20profile%20email&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Flinkedin
Status Code: 500 Internal Server Error
```

## 원인 분석

### 1. 잘못된 클라이언트 ID/Secret
현재 사용 중인 LinkedIn 앱 정보가 유효하지 않을 수 있습니다.

### 2. 리다이렉트 URL 설정 문제
LinkedIn 앱에서 허용된 리다이렉트 URL과 실제 요청 URL이 일치하지 않습니다.

### 3. 스코프 권한 문제
요청한 스코프가 LinkedIn 앱에서 승인되지 않았을 수 있습니다.

## 해결 방법

### 단계 1: LinkedIn Developer 앱 확인
1. [LinkedIn Developer Console](https://www.linkedin.com/developers/apps)에 접속
2. 현재 앱 설정 확인
3. 클라이언트 ID가 `869opboyzlkrhb`인지 확인

### 단계 2: 리다이렉트 URL 설정
LinkedIn 앱 설정에서 다음 URL을 추가해야 합니다:
```
http://localhost:3000/api/auth/callback/linkedin
```

### 단계 3: 스코프 권한 확인
LinkedIn 앱에서 다음 권한이 활성화되어 있는지 확인:
- `r_emailaddress` (이메일 주소 읽기)
- `r_liteprofile` (기본 프로필 정보 읽기)
- `openid` (OpenID Connect)

### 단계 4: 새 LinkedIn 앱 생성 (권장)
기존 앱에 문제가 있을 수 있으므로 새 앱을 생성하는 것을 권장합니다:

1. [LinkedIn Developer Console](https://www.linkedin.com/developers/apps)에서 "Create App" 클릭
2. 앱 정보 입력:
   - **App name**: CareerTalk
   - **LinkedIn Page**: 개인 프로필 또는 회사 페이지
   - **App logo**: 선택사항
   - **Legal agreement**: 체크

3. **Auth** 탭에서 설정:
   - **Authorized redirect URLs**: `http://localhost:3000/api/auth/callback/linkedin`
   - **Scopes**: `r_emailaddress`, `r_liteprofile`, `openid` 선택

4. **Settings** 탭에서 Client ID와 Client Secret 확인

### 단계 5: 환경 변수 업데이트
`.env.local` 파일을 새로운 클라이언트 정보로 업데이트:

```bash
LINKEDIN_CLIENT_ID=새로운_클라이언트_ID
LINKEDIN_CLIENT_SECRET=새로운_클라이언트_SECRET
```

## 임시 해결책

LinkedIn 설정이 복잡하다면 일단 LinkedIn 로그인을 비활성화하고 데모 로그인만 사용할 수 있습니다:

1. `.env.local`에서 LinkedIn 환경 변수 제거
2. 서버 재시작
3. 데모 로그인만 표시됨

## 테스트 방법

1. LinkedIn 앱 설정 완료 후
2. 서버 재시작: `npm run dev`
3. `http://localhost:3000/auth/login`에서 LinkedIn 로그인 테스트
4. 브라우저 개발자 도구에서 네트워크 탭 확인
