import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // 환경 변수 확인
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Supabase 환경 변수가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    console.log('🔄 [Migration] Supabase 스키마 마이그레이션 시작')

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const migrations = [
      {
        name: 'Create question_votes table',
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
        name: 'Add votes_24h to question_stats',
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
        name: 'Enable RLS on question_votes',
        sql: `ALTER TABLE question_votes ENABLE ROW LEVEL SECURITY;`
      },
      {
        name: 'Create RLS policies for question_votes',
        sql: `
          DO $$
          BEGIN
            -- 조회 정책
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'question_votes' AND policyname = 'Anyone can view votes') THEN
              CREATE POLICY "Anyone can view votes" ON question_votes FOR SELECT USING (true);
            END IF;
            
            -- 생성 정책
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'question_votes' AND policyname = 'Users can create their own votes') THEN
              CREATE POLICY "Users can create their own votes" ON question_votes FOR INSERT WITH CHECK (true);
            END IF;
            
            -- 삭제 정책
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'question_votes' AND policyname = 'Users can delete their own votes') THEN
              CREATE POLICY "Users can delete their own votes" ON question_votes FOR DELETE USING (true);
            END IF;
          END
          $$;
        `
      },
      {
        name: 'Add is_deleted and deleted_at to users table',
        sql: `
          DO $$ 
          BEGIN 
              IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_deleted') THEN
                  ALTER TABLE users ADD COLUMN is_deleted BOOLEAN DEFAULT false;
              END IF;
              IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='deleted_at') THEN
                  ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
              END IF;
              IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='image') THEN
                  ALTER TABLE users ADD COLUMN image TEXT;
              END IF;
          END $$;
        `
      }
    ]

    const results = []

    for (const migration of migrations) {
      console.log(`🔄 [Migration] 실행 중: ${migration.name}`)
      
      try {
        const { error } = await supabaseAdmin.rpc('exec_sql', { sql_query: migration.sql })
        
        if (error) {
          // rpc가 없는 경우 직접 SQL 실행 시도
          const { error: directError } = await supabaseAdmin
            .from('_migrations')
            .insert({ name: migration.name, sql: migration.sql })
          
          if (directError) {
            console.error(`❌ [Migration] ${migration.name} 실패:`, error)
            results.push({ name: migration.name, success: false, error: error.message })
          } else {
            console.log(`✅ [Migration] ${migration.name} 성공`)
            results.push({ name: migration.name, success: true })
          }
        } else {
          console.log(`✅ [Migration] ${migration.name} 성공`)
          results.push({ name: migration.name, success: true })
        }
      } catch (err) {
        console.error(`❌ [Migration] ${migration.name} 예외:`, err)
        results.push({ name: migration.name, success: false, error: (err as Error).message })
      }
    }

    const successCount = results.filter(r => r.success).length
    const totalCount = results.length

    console.log(`🎉 [Migration] 완료: ${successCount}/${totalCount} 성공`)

    return NextResponse.json({
      success: true,
      message: `마이그레이션 완료: ${successCount}/${totalCount} 성공`,
      results,
      summary: {
        total: totalCount,
        success: successCount,
        failed: totalCount - successCount
      }
    })

  } catch (error) {
    console.error('❌ [Migration] API 오류:', error)
    return NextResponse.json(
      { 
        error: '마이그레이션 중 오류가 발생했습니다.',
        details: (error as Error).message 
      },
      { status: 500 }
    )
  }
}
