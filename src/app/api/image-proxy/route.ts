import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const imageUrl = request.nextUrl.searchParams.get('url')

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    // LinkedIn 이미지 URL인지 확인
    if (!imageUrl.includes('media.licdn.com')) {
      return NextResponse.json(
        { error: 'Only LinkedIn images are supported' },
        { status: 400 }
      )
    }

    console.log('🖼️ [Image Proxy] LinkedIn 이미지 프록시 요청:', imageUrl.substring(0, 100) + '...')

    // LinkedIn 이미지를 서버에서 가져오기
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site'
      }
    })

    if (!response.ok) {
      console.error('❌ [Image Proxy] LinkedIn 이미지 가져오기 실패:', response.status, response.statusText)
      return new NextResponse('Image not found', { status: 404 })
    }

    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    console.log('✅ [Image Proxy] 이미지 프록시 성공:', {
      contentType,
      size: imageBuffer.byteLength
    })

    // 이미지 데이터를 클라이언트에 반환
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, immutable', // 1시간 캐시
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })

  } catch (error) {
    console.error('❌ [Image Proxy] API 오류:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
