import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [Env Check] 환경 변수 체크 시작')
    
    const envVars = {
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      LINKEDIN_CLIENT_ID: !!process.env.LINKEDIN_CLIENT_ID,
      LINKEDIN_CLIENT_SECRET: !!process.env.LINKEDIN_CLIENT_SECRET,
      NODE_ENV: process.env.NODE_ENV,
    }
    
    console.log('🔍 [Env Check] 환경 변수 상태:', envVars)
    
    const missingVars = Object.entries(envVars)
      .filter(([key, value]) => key !== 'NODE_ENV' && !value)
      .map(([key]) => key)
    
    return NextResponse.json({
      success: true,
      message: '환경 변수 체크 완료',
      envVars,
      missingVars,
      hasAllRequiredVars: missingVars.length === 0
    })
  } catch (error) {
    console.error('Env Check 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
