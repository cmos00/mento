#!/usr/bin/env node

/**
 * Supabase 마이그레이션 헬퍼 스크립트
 * 
 * 사용법:
 * node migrate.js
 * 
 * 또는 브라우저에서:
 * fetch('/api/migrate', { method: 'POST' }).then(r => r.json()).then(console.log)
 */

const https = require('https');

const MIGRATIONS = [
  {
    name: 'question_votes 테이블 생성',
    description: '투표 기능을 위한 테이블 생성',
    sql: `
      CREATE TABLE IF NOT EXISTS question_votes (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(question_id, user_id)
      );
    `
  },
  {
    name: 'question_stats 업데이트',
    description: 'votes_24h 컬럼 추가',
    sql: `
      DO $$ 
      BEGIN 
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='question_stats' AND column_name='votes_24h') THEN
              ALTER TABLE question_stats ADD COLUMN votes_24h INTEGER DEFAULT 0;
          END IF;
      END $$;
    `
  },
  {
    name: 'RLS 정책 설정',
    description: 'question_votes 테이블 보안 정책',
    sql: `
      ALTER TABLE question_votes ENABLE ROW LEVEL SECURITY;
      
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'question_votes' AND policyname = 'Anyone can view votes') THEN
          CREATE POLICY "Anyone can view votes" ON question_votes FOR SELECT USING (true);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'question_votes' AND policyname = 'Users can create their own votes') THEN
          CREATE POLICY "Users can create their own votes" ON question_votes FOR INSERT WITH CHECK (true);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'question_votes' AND policyname = 'Users can delete their own votes') THEN
          CREATE POLICY "Users can delete their own votes" ON question_votes FOR DELETE USING (true);
        END IF;
      END
      $$;
    `
  }
];

console.log('🚀 Supabase 마이그레이션 가이드');
console.log('=====================================\n');

console.log('📋 실행할 마이그레이션:');
MIGRATIONS.forEach((migration, index) => {
  console.log(`${index + 1}. ${migration.name}`);
  console.log(`   ${migration.description}\n`);
});

console.log('🔧 실행 방법 (아래 중 하나 선택):');
console.log('');
console.log('방법 1: Supabase 대시보드에서 수동 실행');
console.log('  1. https://supabase.com/dashboard 접속');
console.log('  2. 프로젝트 선택 > SQL Editor');
console.log('  3. 아래 SQL을 복사해서 실행\n');

console.log('방법 2: 브라우저 콘솔에서 자동 실행');
console.log('  1. https://mento-five.vercel.app/questions 접속');
console.log('  2. 개발자 도구 > 콘솔');
console.log('  3. 아래 코드 실행:\n');
console.log('fetch(\'/api/migrate\', { method: \'POST\' })');
console.log('  .then(r => r.json())');
console.log('  .then(console.log)\n');

console.log('방법 3: 개별 SQL 실행');
console.log('아래 SQL들을 순서대로 Supabase SQL Editor에서 실행:\n');

MIGRATIONS.forEach((migration, index) => {
  console.log(`-- ${index + 1}. ${migration.name}`);
  console.log(`-- ${migration.description}`);
  console.log(migration.sql.trim());
  console.log('');
});

console.log('✅ 마이그레이션 완료 후:');
console.log('  - 투표 기능이 활성화됩니다');
console.log('  - 좋아요 수가 실제 데이터로 표시됩니다');
console.log('  - 트렌딩 로직에 투표가 반영됩니다\n');

console.log('❓ 문제가 있다면:');
console.log('  - 콘솔 로그 확인');
console.log('  - 네트워크 탭에서 API 응답 확인');
console.log('  - Supabase 로그 확인');
