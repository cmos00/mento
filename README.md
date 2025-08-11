# Career Feedback Platform

직장 경력 3~7년차 직장인들을 위한 맞춤형 커리어 피드백 플랫폼입니다.

## 주요 기능

- 🔗 LinkedIn 연동을 통한 신뢰도 확보
- 📝 구조화된 질문 작성 템플릿
- 🤝 AI 기반 멘토 매칭 시스템
- 💬 1:1 비동기 멘토링
- 📊 커리어 저널 및 히스토리 관리
- 🎁 리워드 및 보상 시스템
- ⭐ 피드백 품질 검수 시스템

## 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js (LinkedIn OAuth)
- **Database**: Prisma + PostgreSQL
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
DATABASE_URL=your-database-url
```

### 3. 데이터베이스 설정
```bash
npx prisma generate
npx prisma db push
```

### 4. 개발 서버 실행
```bash
npm run dev
```

### 5. 빌드
```bash
npm run build
```

### 6. 프로덕션 서버 실행
```bash
npm start
```

## 프로젝트 구조

```
src/
├── app/              # Next.js App Router
├── components/       # 재사용 가능한 컴포넌트
├── lib/             # 유틸리티 함수 및 설정
├── types/           # TypeScript 타입 정의
├── prisma/          # 데이터베이스 스키마
└── hooks/           # 커스텀 React 훅
```

## 라이센스

MIT
