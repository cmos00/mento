# Career Feedback Platform

경력 3~7년차 직장인들을 위한 맞춤형 커리어 피드백 플랫폼입니다.

## 주요 기능

- **커리어 질문**: 구조화된 템플릿을 통해 상황과 맥락을 명확하게 전달하고 전문적인 피드백을 받아보세요.
- **멘토 매칭**: AI 기반 추천 시스템으로 직무 유사도와 경험을 고려한 최적의 멘토를 자동으로 매칭해드립니다.
- **커리어 저널**: 받은 피드백과 멘토링 기록을 체계적으로 저장하고 후속 액션을 관리하여 커리어 성장을 추적하세요.
- **커피 쿠폰 시스템**: 멘토에게 감사의 마음을 전달하고 실제 카페에서 사용할 수 있는 커피 쿠폰을 제공합니다.

## 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js (Mock 인증)
- **Database**: Prisma + PostgreSQL
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Utilities**: date-fns, clsx, tailwind-merge

## 시작하기

### 1. 저장소 클론
```bash
git clone https://github.com/cmos00/mento.git
cd mento
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# NextAuth.js
NEXTAUTH_SECRET=your-super-secret-key-here-make-it-long-and-random
NEXTAUTH_URL=http://localhost:3000

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Career Feedback Platform
```

### 4. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── api/auth/          # NextAuth.js API
│   ├── auth/              # 인증 관련 페이지
│   ├── questions/         # 질문 관련 페이지
│   ├── splash/            # 스플래시 화면
│   └── layout.tsx         # 루트 레이아웃
├── components/            # React 컴포넌트
├── lib/                   # 유틸리티 함수들
└── types/                 # TypeScript 타입 정의
```

## 개발 상태

- ✅ **기본 프로젝트 구조** 완성
- ✅ **모바일 퍼스트 UI/UX** 구현
- ✅ **Mock 인증 시스템** 구현
- ✅ **커리어 피드백 플랫폼** 핵심 페이지들
- 🔄 **LinkedIn OAuth 연동** (향후 구현 예정)
- 🔄 **데이터베이스 연결** (향후 구현 예정)

## 라이선스

MIT License
