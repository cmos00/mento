-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  company VARCHAR(255),
  position VARCHAR(255),
  experience VARCHAR(100),
  bio TEXT,
  skills TEXT[],
  linkedin_url TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  tags TEXT[],
  is_anonymous BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create answers table
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  helpful_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mentors table
CREATE TABLE mentors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  experience VARCHAR(100) NOT NULL,
  specialties TEXT[],
  bio TEXT NOT NULL,
  hourly_rate INTEGER NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  total_mentoring INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mentoring_requests table
CREATE TABLE mentoring_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mentor_id UUID REFERENCES mentors(id) ON DELETE CASCADE,
  topic VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  preferred_date DATE,
  preferred_time TIME,
  duration INTEGER NOT NULL, -- in minutes
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create coffee_coupons table
CREATE TABLE coffee_coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- in won
  message TEXT,
  mentoring_id UUID REFERENCES mentoring_requests(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create journals table
CREATE TABLE journals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  mood VARCHAR(50) NOT NULL,
  tags TEXT[],
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_questions_user_id ON questions(user_id);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_created_at ON questions(created_at);
CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_answers_user_id ON answers(user_id);
CREATE INDEX idx_mentors_user_id ON mentors(user_id);
CREATE INDEX idx_mentors_specialties ON mentors USING GIN(specialties);
CREATE INDEX idx_mentoring_requests_mentor_id ON mentoring_requests(mentor_id);
CREATE INDEX idx_mentoring_requests_mentee_id ON mentoring_requests(mentee_id);
CREATE INDEX idx_coffee_coupons_receiver_id ON coffee_coupons(receiver_id);
CREATE INDEX idx_coffee_coupons_sender_id ON coffee_coupons(sender_id);
CREATE INDEX idx_journals_user_id ON journals(user_id);
CREATE INDEX idx_journals_created_at ON journals(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_answers_updated_at BEFORE UPDATE ON answers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mentors_updated_at BEFORE UPDATE ON mentors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mentoring_requests_updated_at BEFORE UPDATE ON mentoring_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coffee_coupons_updated_at BEFORE UPDATE ON coffee_coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_journals_updated_at BEFORE UPDATE ON journals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO users (email, name, company, position, experience, bio, skills) VALUES
('mentor1@example.com', '김시니어', '네이버', '시니어 백엔드 개발자', '8년차', '대규모 서비스 개발 경험을 바탕으로 백엔드 개발과 시스템 설계에 대한 실무적인 조언을 드립니다.', ARRAY['백엔드', '시스템설계', '팀리딩']),
('mentor2@example.com', '박매니저', '카카오', '프로덕트 매니저', '5년차', '사용자 경험을 개선하는 프로덕트 매니저입니다. 데이터 기반 의사결정과 사용자 중심 설계에 관심이 많습니다.', ARRAY['프로덕트 기획', '데이터 분석', '사용자 리서치']);

INSERT INTO mentors (user_id, title, company, experience, specialties, bio, hourly_rate, rating, total_mentoring, is_verified) VALUES
((SELECT id FROM users WHERE email = 'mentor1@example.com'), '시니어 백엔드 개발자', '네이버', '8년차', ARRAY['백엔드', '시스템설계', '팀리딩'], '대규모 서비스 개발 경험을 바탕으로 백엔드 개발과 시스템 설계에 대한 실무적인 조언을 드립니다.', 150000, 4.9, 89, true),
((SELECT id FROM users WHERE email = 'mentor2@example.com'), '프로덕트 매니저', '카카오', '5년차', ARRAY['프로덕트 기획', '데이터 분석', '사용자 리서치'], '사용자 경험을 개선하는 프로덕트 매니저입니다. 데이터 기반 의사결정과 사용자 중심 설계에 관심이 많습니다.', 120000, 4.8, 67, true);
