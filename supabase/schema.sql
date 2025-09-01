-- Supabase 데이터베이스 스키마

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  company TEXT,
  position TEXT,
  experience TEXT,
  bio TEXT,
  skills TEXT[],
  linkedin_url TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 질문 테이블
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[],
  is_anonymous BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'open',
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 피드백 테이블
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  examples TEXT,
  advice TEXT,
  resources TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_questions_user_id ON questions(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_status ON questions(status);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at);
CREATE INDEX IF NOT EXISTS idx_feedbacks_question_id ON feedbacks(question_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_user_id ON feedbacks(user_id);

-- RLS (Row Level Security) 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- RLS 정책
-- 사용자는 자신의 정보만 수정 가능
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- NextAuth 사용자를 위한 INSERT 정책 (RLS 우회)
CREATE POLICY "Allow user creation for NextAuth users" ON users
  FOR INSERT WITH CHECK (true);

-- 질문은 모든 사용자가 볼 수 있음
CREATE POLICY "Questions are viewable by everyone" ON questions
  FOR SELECT USING (true);

-- 로그인한 사용자만 질문 작성 가능 (NextAuth 사용자 포함)
CREATE POLICY "Authenticated users can create questions" ON questions
  FOR INSERT WITH CHECK (true);

-- 질문 작성자만 수정/삭제 가능
CREATE POLICY "Users can update own questions" ON questions
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own questions" ON questions
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- 피드백은 모든 사용자가 볼 수 있음
CREATE POLICY "Feedbacks are viewable by everyone" ON feedbacks
  FOR SELECT USING (true);

-- 로그인한 사용자만 피드백 작성 가능 (NextAuth 사용자 포함)
CREATE POLICY "Authenticated users can create feedbacks" ON feedbacks
  FOR INSERT WITH CHECK (true);

-- 피드백 작성자만 수정/삭제 가능
CREATE POLICY "Users can update own feedbacks" ON feedbacks
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own feedbacks" ON feedbacks
  FOR DELETE USING (auth.uid()::text = user_id::text);
