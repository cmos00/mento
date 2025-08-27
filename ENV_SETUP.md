# 환경 변수 설정 가이드

## 필수 환경 변수

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# NextAuth 설정
NEXTAUTH_SECRET=+f+1KjaN16QNlo0Y+wx2xyIgW5f9p6/vASvXegt7HTQ=
NEXTAUTH_URL=http://localhost:3000

# LinkedIn OAuth 설정
LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here

# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 환경 변수 설명

### NEXTAUTH_SECRET
- NextAuth.js의 JWT 암호화에 사용되는 비밀키
- 프로덕션에서는 강력한 랜덤 문자열로 변경해야 함
- 예: `openssl rand -base64 32` 명령어로 생성

### NEXTAUTH_URL
- 애플리케이션의 기본 URL
- 개발 환경: `http://localhost:3000`
- 프로덕션: 실제 도메인 URL

### LINKEDIN_CLIENT_ID & LINKEDIN_CLIENT_SECRET
- LinkedIn Developer Portal에서 앱을 생성하여 얻는 OAuth 인증 정보
- [LinkedIn Developer Portal](https://www.linkedin.com/developers/)에서 설정

### NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY
- Supabase 프로젝트의 URL과 익명 API 키
- Supabase 프로젝트 설정에서 확인 가능
- 형식: `https://your-project-id.supabase.co`

## 설정 순서

1. `.env.local` 파일 생성
2. 환경 변수 값 설정
3. LinkedIn OAuth 앱 설정
4. Supabase 프로젝트 설정
5. `supabase/schema.sql` 스키마 적용
6. `npm run dev`로 개발 서버 시작

## 주의사항

- `.env.local` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않음
- 프로덕션 환경에서는 환경 변수를 서버 설정에 직접 추가
- 민감한 정보(API 키, 비밀번호 등)는 절대 코드에 하드코딩하지 마세요
