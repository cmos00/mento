-- ============================================
-- 멘토링 컬럼 확인 및 생성 SQL 스크립트
-- ============================================

-- 1. users 테이블의 모든 컬럼 확인
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'users'
ORDER BY ordinal_position;

-- 2. mentoring_enabled 컬럼 존재 확인
SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users'
      AND column_name = 'mentoring_enabled'
) AS column_exists;

-- 3. mentoring_enabled 컬럼이 없다면 생성
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'users'
          AND column_name = 'mentoring_enabled'
    ) THEN
        ALTER TABLE users 
        ADD COLUMN mentoring_enabled BOOLEAN DEFAULT false;
        
        RAISE NOTICE '✅ mentoring_enabled 컬럼이 생성되었습니다.';
    ELSE
        RAISE NOTICE '✅ mentoring_enabled 컬럼이 이미 존재합니다.';
    END IF;
END $$;

-- 4. 인덱스 생성 (이미 있으면 무시됨)
CREATE INDEX IF NOT EXISTS idx_users_mentoring_enabled 
ON users(mentoring_enabled);

-- 5. 현재 users 테이블의 mentoring_enabled 값 확인
SELECT 
    id,
    email,
    name,
    mentoring_enabled,
    created_at
FROM users
ORDER BY created_at DESC
LIMIT 10;

-- 6. mentoring_enabled 통계
SELECT 
    mentoring_enabled,
    COUNT(*) as user_count
FROM users
GROUP BY mentoring_enabled;

