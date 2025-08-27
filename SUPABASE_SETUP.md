# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com/)에 접속하여 로그인
2. "New Project" 클릭
3. 프로젝트 이름: `career-talk` (또는 원하는 이름)
4. 데이터베이스 비밀번호 설정 (기억해두세요!)
5. 지역 선택 (가까운 지역 선택)
6. "Create new project" 클릭

## 2. 프로젝트 설정에서 API 키 확인

1. 프로젝트 대시보드에서 "Settings" → "API" 클릭
2. 다음 정보를 복사:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 3. 환경 변수 설정

`.env.local` 파일에 다음 내용을 추가/수정:

```bash
# NextAuth 설정
NEXTAUTH_SECRET=your_nextauth_secret_here_change_this_in_production
NEXTAUTH_URL=http://localhost:3000

# LinkedIn OAuth 설정
LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here

# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. 데이터베이스 스키마 적용

1. Supabase 대시보드에서 "SQL Editor" 클릭
2. "New query" 클릭
3. `supabase/schema.sql` 파일의 내용을 복사하여 붙여넣기
4. "Run" 클릭하여 스키마 실행

## 5. 인증 설정

1. "Authentication" → "Settings" 클릭
2. "Site URL"을 `http://localhost:3000`으로 설정
3. "Redirect URLs"에 다음 추가:
   - `http://localhost:3000/api/auth/callback/linkedin`
   - `http://localhost:3000/auth/signin`

## 6. RLS (Row Level Security) 확인

스키마 적용 후 다음 테이블에 RLS가 활성화되어 있는지 확인:
- `users`
- `questions` 
- `feedbacks`

## 7. 테스트

1. 개발 서버 재시작: `npm run dev`
2. 브라우저에서 `http://localhost:3000` 접속
3. 로그인 기능 테스트

## 문제 해결

### RLS 오류가 발생하는 경우
- SQL Editor에서 RLS 정책을 다시 실행
- 테이블별로 RLS가 활성화되어 있는지 확인

### 인증 오류가 발생하는 경우
- 환경 변수가 올바르게 설정되었는지 확인
- Supabase 프로젝트 URL과 API 키 확인
- NextAuth 설정 확인

### 데이터베이스 연결 오류
- Supabase 프로젝트가 활성 상태인지 확인
- 네트워크 연결 상태 확인
