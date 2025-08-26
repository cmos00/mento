# CareerTalk - 커리어 멘토링 플랫폼

커리어 고민을 솔직하게 나누고 전문가들의 조언을 받을 수 있는 익명 커뮤니티 플랫폼입니다.

## 🚀 주요 기능

- **익명 커뮤니티**: 개인정보 노출 없이 솔직한 고민 공유
- **전문가 멘토링**: 검증된 경력을 가진 시니어들의 조언
- **24시간 접근**: 언제든 질문하고 답변받기
- **간편한 로그인**: LinkedIn OAuth 또는 이메일과 이름으로 빠른 가입

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Authentication**: NextAuth.js, LinkedIn OAuth, 데모 로그인
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## 📋 환경 설정

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# NextAuth 설정
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# LinkedIn OAuth 설정
LINKEDIN_CLIENT_ID=86uazq240kcie4
LINKEDIN_CLIENT_SECRET=WPL_AP1.qFs6fUwTDvFw5siK.UQyA/w==

# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 2. LinkedIn OAuth 설정

1. [LinkedIn Developer Portal](https://www.linkedin.com/developers/)에서 앱 설정
2. OAuth 2.0 설정에서 리다이렉트 URL 추가:
   - `http://localhost:3000/api/auth/callback/linkedin`
3. OAuth 2.0 스코프 설정:
   - `openid`: 사용자 식별
   - `profile`: 이름과 사진 사용
   - `w_member_social`: 게시물, 댓글, 반응 생성/수정/삭제
   - `email`: LinkedIn 계정의 기본 이메일 주소 사용

### 3. Supabase 설정

1. [Supabase](https://supabase.com/)에서 새 프로젝트 생성
2. 프로젝트 설정에서 API 키와 URL 복사
3. `supabase/schema.sql` 파일의 스키마를 데이터베이스에 적용

## 🚀 로컬 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하세요.

## 🔐 로그인 방법

### LinkedIn OAuth 로그인
- LinkedIn 계정으로 안전하고 빠른 로그인
- 프로필 정보 자동 동기화
- 전문적인 네트워크 활용

### 데모 로그인
- **이메일**: `demo@example.com` (변경 가능)
- **이름**: `데모 사용자` (변경 가능)
- 실제 데이터베이스에 사용자 정보 저장
- 간편하고 빠른 로그인

## 📱 주요 페이지

- **홈**: 플랫폼 소개 및 시작하기
- **질문 목록**: 커뮤니티의 모든 질문과 답변
- **질문 작성**: 새로운 커리어 고민 등록
- **프로필**: 개인 정보 및 활동 내역
- **멘토**: 전문가 멘토 프로필

## 🐛 문제 해결

### 데모 로그인 사용
- 이메일과 이름만 입력하여 빠르게 로그인
- 실제 데이터베이스에 사용자 정보 저장
- 개발 및 테스트에 최적화

## 📄 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
