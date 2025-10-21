-- 멘토 테이블 생성
CREATE TABLE IF NOT EXISTS mentors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  experience TEXT NOT NULL,
  specialties TEXT[] DEFAULT '{}',
  bio TEXT NOT NULL,
  rating NUMERIC(2, 1) DEFAULT 0.0,
  reviews_count INTEGER DEFAULT 0,
  response_rate INTEGER DEFAULT 0,
  avg_response_time TEXT DEFAULT '24시간',
  badges TEXT[] DEFAULT '{}',
  hourly_rate INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  total_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 멘토 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_mentors_user_id ON mentors(user_id);
CREATE INDEX IF NOT EXISTS idx_mentors_specialties ON mentors USING GIN(specialties);
CREATE INDEX IF NOT EXISTS idx_mentors_rating ON mentors(rating);
CREATE INDEX IF NOT EXISTS idx_mentors_is_available ON mentors(is_available);
CREATE INDEX IF NOT EXISTS idx_mentors_created_at ON mentors(created_at);

-- RLS 활성화
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "Anyone can view mentors" ON mentors
  FOR SELECT USING (true);

CREATE POLICY "Users can update own mentor profile" ON mentors
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own mentor profile" ON mentors
  FOR INSERT WITH CHECK (true);

-- 목업 데이터 삽입
INSERT INTO mentors (id, user_id, title, company, experience, specialties, bio, rating, reviews_count, response_rate, avg_response_time, badges, is_available, is_verified)
VALUES
  (
    gen_random_uuid(),
    NULL,
    '시니어 백엔드 개발자',
    '네이버',
    '8년차',
    ARRAY['백엔드', '시스템설계', '팀리딩', 'Java', 'Spring', 'MSA'],
    '대규모 서비스 개발 경험을 바탕으로 백엔드 개발과 시스템 설계에 대한 실무적인 조언을 드립니다. 특히 MSA 아키텍처 전환과 대용량 트래픽 처리에 대한 경험을 공유할 수 있습니다.',
    4.9,
    127,
    95,
    '2시간',
    ARRAY['인기 멘토', '답변왕'],
    true,
    true
  ),
  (
    gen_random_uuid(),
    NULL,
    '프로덕트 매니저',
    '카카오',
    '6년차',
    ARRAY['프로덕트', '기획', '데이터분석', 'PM', 'PO', 'Growth'],
    'B2C 프로덕트 기획부터 런칭까지의 전 과정을 경험했습니다. PM 커리어에 대한 고민을 함께 나눠요. 특히 데이터 기반 의사결정과 그로스 해킹에 관심이 많습니다.',
    4.8,
    89,
    92,
    '3시간',
    ARRAY['신뢰 멘토'],
    true,
    true
  ),
  (
    gen_random_uuid(),
    NULL,
    'UX 디자이너',
    '토스',
    '5년차',
    ARRAY['UX디자인', '사용자리서치', '디자인시스템', 'Figma', 'UI'],
    '사용자 중심의 디자인과 디자이너의 커리어 성장에 대해 이야기해요. 디자인 시스템 구축과 사용자 리서치 방법론에 대한 실무 경험을 공유합니다.',
    4.7,
    64,
    88,
    '4시간',
    ARRAY['전문가'],
    true,
    true
  ),
  (
    gen_random_uuid(),
    NULL,
    '프론트엔드 리드',
    '쿠팡',
    '7년차',
    ARRAY['프론트엔드', 'React', 'TypeScript', '팀리딩', '성능최적화'],
    '프론트엔드 개발부터 팀 리딩까지 다양한 경험을 쌓았습니다. React 생태계와 성능 최적화, 그리고 개발 조직 문화에 대해 함께 고민해볼 수 있습니다.',
    4.9,
    103,
    97,
    '2시간',
    ARRAY['인기 멘토', '전문가'],
    true,
    true
  ),
  (
    gen_random_uuid(),
    NULL,
    '데이터 사이언티스트',
    '배달의민족',
    '5년차',
    ARRAY['데이터분석', '머신러닝', 'Python', 'SQL', 'A/B테스트'],
    '데이터 분석과 머신러닝을 활용한 비즈니스 임팩트 창출에 관심이 많습니다. A/B 테스트 설계부터 모델 배포까지 실무 경험을 나눌 수 있습니다.',
    4.6,
    52,
    85,
    '5시간',
    ARRAY['신뢰 멘토'],
    true,
    false
  ),
  (
    gen_random_uuid(),
    NULL,
    'DevOps 엔지니어',
    '당근마켓',
    '6년차',
    ARRAY['DevOps', 'AWS', 'Kubernetes', 'CI/CD', 'Infrastructure'],
    '클라우드 인프라 구축과 자동화에 대한 경험을 공유합니다. AWS 기반의 서비스 운영과 Kubernetes 도입 경험이 있습니다.',
    4.8,
    71,
    90,
    '3시간',
    ARRAY['전문가'],
    true,
    true
  );

-- user_id를 NULL로 설정했으므로 실제 사용 시 users 테이블의 실제 UUID로 업데이트 필요
-- 또는 임시 사용자를 생성하여 연결할 수 있습니다

