-- users 테이블에 mentoring_enabled 컬럼 추가
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS mentoring_enabled BOOLEAN DEFAULT false;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_users_mentoring_enabled ON users(mentoring_enabled);

