# 멘토링 기능 설정 가이드

## 문제 상황
프로필 페이지에서 "멘토링 상태" 토글을 클릭하면 다음과 같은 알림이 나타납니다:
```
데이터베이스에 mentoring_enabled 컬럼이 필요합니다.
Supabase SQL Editor에서 다음 SQL을 실행하세요:

ALTER TABLE users ADD COLUMN IF NOT EXISTS mentoring_enabled BOOLEAN DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_users_mentoring_enabled ON users(mentoring_enabled);
```

## 해결 방법

### 1단계: Supabase 대시보드 접속

1. 브라우저에서 [https://supabase.com](https://supabase.com) 접속
2. 로그인 (GitHub 계정으로 로그인)
3. 프로젝트 목록에서 `mento` 프로젝트 선택

### 2단계: SQL Editor 열기

1. 좌측 사이드바에서 **SQL Editor** 클릭
2. 우측 상단의 **New query** 버튼 클릭

### 3단계: SQL 실행

다음 SQL 코드를 복사해서 SQL Editor에 붙여넣기:

```sql
-- users 테이블에 mentoring_enabled 컬럼 추가
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS mentoring_enabled BOOLEAN DEFAULT false;

-- 인덱스 추가 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_users_mentoring_enabled ON users(mentoring_enabled);

-- 확인: 컬럼이 제대로 추가되었는지 확인
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'mentoring_enabled';
```

### 4단계: SQL 실행 및 확인

1. SQL Editor 우측 하단의 **Run** 버튼 클릭 (또는 `Cmd + Enter` / `Ctrl + Enter`)
2. 성공 메시지 확인:
   ```
   Success. No rows returned
   ```
3. 아래쪽 Results 탭에서 컬럼 정보 확인:
   ```
   column_name: mentoring_enabled
   data_type: boolean
   is_nullable: YES
   column_default: false
   ```

### 5단계: 웹사이트에서 확인

1. [https://mento-five.vercel.app/profile](https://mento-five.vercel.app/profile) 페이지 새로고침 (`Cmd + R` / `Ctrl + R`)
2. "멘토링 상태" 토글 클릭
3. 정상적으로 ON/OFF 전환되는지 확인
4. "멘토링 1:1 상담 받기" 문구가 변경되는지 확인:
   - **ON 상태**: "멘토링 1:1 상담 받기" (초록색 체크 아이콘)
   - **OFF 상태**: "멘토링 1:1 상담 안받기" (회색 X 아이콘)

## 추가 정보

### 멘토링 상태가 하는 일

- **ON (활성화)**: 다른 사용자가 내 답변을 보고 "1:1 상담 신청" 버튼을 클릭할 수 있음
- **OFF (비활성화)**: 내 답변에 "1:1 상담 신청" 버튼이 표시되지 않음

### SQL 명령어 설명

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS mentoring_enabled BOOLEAN DEFAULT false;
```
- `ALTER TABLE users`: users 테이블을 수정
- `ADD COLUMN`: 새 컬럼 추가
- `IF NOT EXISTS`: 이미 존재하면 에러 없이 건너뛰기
- `mentoring_enabled`: 컬럼 이름
- `BOOLEAN`: 데이터 타입 (true/false)
- `DEFAULT false`: 기본값은 false (멘토링 비활성화)

```sql
CREATE INDEX IF NOT EXISTS idx_users_mentoring_enabled ON users(mentoring_enabled);
```
- `CREATE INDEX`: 인덱스 생성 (데이터 검색 속도 향상)
- `IF NOT EXISTS`: 이미 존재하면 건너뛰기
- `idx_users_mentoring_enabled`: 인덱스 이름
- `ON users(mentoring_enabled)`: users 테이블의 mentoring_enabled 컬럼에 인덱스 생성

## 문제 해결

### 에러: "permission denied for table users"
- Supabase에서 로그인한 계정이 프로젝트 소유자인지 확인
- Supabase 대시보드 우측 상단에서 프로젝트 소유자로 전환

### 에러: "column already exists"
- 이미 컬럼이 추가된 상태입니다. 브라우저를 새로고침하세요.
- 여전히 문제가 있다면, 다음 SQL로 컬럼 존재 여부 확인:
  ```sql
  SELECT column_name 
  FROM information_schema.columns 
  WHERE table_name = 'users' AND column_name = 'mentoring_enabled';
  ```

### 토글이 작동하지 않음
1. 브라우저 개발자 도구 열기 (`F12` 또는 `Cmd + Option + I`)
2. Console 탭에서 에러 메시지 확인
3. Network 탭에서 `/api/user/update` 요청이 성공했는지 확인 (Status: 200)

## 참고 자료

- [Supabase SQL Editor 문서](https://supabase.com/docs/guides/database/sql-editor)
- [PostgreSQL ALTER TABLE 문서](https://www.postgresql.org/docs/current/sql-altertable.html)
- [프로젝트 Schema 파일](/supabase/add_mentoring_enabled.sql)

## 완료 체크리스트

- [ ] Supabase SQL Editor에서 SQL 실행 완료
- [ ] "Success" 메시지 확인
- [ ] 컬럼 정보 확인 쿼리 실행 성공
- [ ] 웹사이트에서 멘토링 토글 정상 작동
- [ ] 브라우저 개발자 도구에서 에러 없음 확인

---

**작성일**: 2025-01-28
**작성자**: Development Team
**관련 파일**: 
- `/src/app/profile/page.tsx`
- `/src/app/api/user/update/route.ts`
- `/supabase/add_mentoring_enabled.sql`

