# Supabase 마이그레이션 가이드

## 🚨 필수 실행 사항

멘토링 기능을 사용하려면 Supabase에서 다음 SQL을 **반드시 실행**해야 합니다.

### 1. Supabase Dashboard 접속
https://app.supabase.com/project/tpfamzghtqjwqahsddml/editor

### 2. SQL Editor에서 실행할 쿼리

```sql
-- users 테이블에 mentoring_enabled 컬럼 추가
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS mentoring_enabled BOOLEAN DEFAULT false;

-- 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_users_mentoring_enabled ON users(mentoring_enabled);
```

### 3. 실행 방법
1. Supabase Dashboard → SQL Editor 메뉴로 이동
2. 위 SQL 쿼리를 복사하여 붙여넣기
3. "Run" 버튼 클릭
4. 성공 메시지 확인

### 4. 확인 방법
```sql
-- mentoring_enabled 컬럼이 추가되었는지 확인
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'mentoring_enabled';
```

## 📝 관련 파일들

- SQL 스크립트: `/supabase/add_mentoring_enabled.sql`
- 프로필 페이지: `/src/app/profile/page.tsx`
- 질문 상세 페이지: `/src/app/questions/[id]/page.tsx`
- API 업데이트: `/src/app/api/user/update/route.ts`

## ⚠️ 주의사항

이 마이그레이션을 실행하지 않으면:
- 프로필 페이지에서 멘토링 토글 변경 시 에러 발생
- 질문 페이지에서 "1:1 상담 신청" 버튼이 제대로 동작하지 않음

## ✅ 완료 후 테스트

1. https://mento-five.vercel.app/profile 접속
2. 멘토링 상태 토글 클릭
3. 에러 없이 상태가 변경되는지 확인
4. https://mento-five.vercel.app/questions/[질문ID] 페이지에서 답변에 "1:1 상담 신청" 버튼이 표시되는지 확인

