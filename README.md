# CareerTalk - 커리어 멘토링 플랫폼

경력 3~7년차 직장인들을 위한 맞춤형 커리어 피드백 플랫폼입니다.

## 🚀 주요 기능

- **질문 & 답변**: 커리어 고민에 대한 전문가 조언
- **멘토링 시스템**: 1:1 멘토링 신청 및 관리
- **커피쿠폰**: 멘토링 후 감사 표현
- **저널**: 개인 커리어 성장 기록
- **프로필 관리**: 상세한 경력 및 스킬 정보

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## 📱 모바일 최적화

- 반응형 디자인
- 모바일 하단 탭바
- 터치 친화적 UI
- 모바일 특화 CSS 최적화

## 🚀 배포 가이드

### 1. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 실행
3. Settings > API에서 URL과 anon key 복사

### 2. 환경 변수 설정

`.env.local` 파일 생성:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key
```

### 3. Vercel 배포

1. [Vercel](https://vercel.com)에서 새 프로젝트 생성
2. GitHub 저장소 연결
3. 환경 변수 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
4. 배포 실행

### 4. Supabase RLS (Row Level Security) 설정

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentoring_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE coffee_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE journals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view public profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Questions are viewable by everyone" ON questions FOR SELECT USING (true);
CREATE POLICY "Users can create questions" ON questions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own questions" ON questions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Answers are viewable by everyone" ON answers FOR SELECT USING (true);
CREATE POLICY "Users can create answers" ON answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own answers" ON answers FOR UPDATE USING (auth.uid() = user_id);
```

## 🏃‍♂️ 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # 인증 관련 페이지
│   ├── coffee/            # 커피쿠폰 시스템
│   ├── journal/           # 저널 시스템
│   ├── mentors/           # 멘토 시스템
│   ├── profile/           # 프로필 관리
│   ├── questions/         # 질문 & 답변
│   └── search/            # 검색 기능
├── components/             # 재사용 가능한 컴포넌트
├── lib/                   # 유틸리티 및 설정
└── types/                 # TypeScript 타입 정의
```

## 🔐 인증 시스템

- LinkedIn OAuth 연동
- Mock 인증 (개발용)
- 세션 관리
- 프로필 인증

## 💰 커피쿠폰 시스템

- 멘토링 후 감사 표현
- QR코드 기반 사용
- 실제 카페 연동
- 만료일 관리

## 📊 데이터베이스 스키마

- **users**: 사용자 정보
- **questions**: 질문
- **answers**: 답변
- **mentors**: 멘토 정보
- **mentoring_requests**: 멘토링 신청
- **coffee_coupons**: 커피쿠폰
- **journals**: 저널

## 🌟 특징

- **모바일 우선**: 모바일에서 최적화된 사용자 경험
- **실시간**: 실시간 알림 및 업데이트
- **보안**: RLS를 통한 데이터 보안
- **확장성**: 마이크로서비스 아키텍처 준비
- **성능**: Next.js 14의 최신 기능 활용

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.
