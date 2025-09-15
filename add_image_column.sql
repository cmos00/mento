-- Supabase SQL Editor에서 실행할 명령
-- users 테이블에 image 칼럼 추가

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='image') THEN
        ALTER TABLE users ADD COLUMN image TEXT;
        RAISE NOTICE 'image 칼럼이 users 테이블에 추가되었습니다.';
    ELSE
        RAISE NOTICE 'image 칼럼이 이미 존재합니다.';
    END IF;
END $$;
