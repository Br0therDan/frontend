import { NextResponse, NextRequest } from 'next/server'
import { AuthService } from '@/lib/api' // openapi-generator 등으로 생성된 API 클라이언트

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh_token')?.value
  if (!refreshToken) {
    return NextResponse.json(
      { detail: 'Refresh token is missing' },
      { status: 403 }
    )
  }

  try {
    const backendResponse = await AuthService.authRefreshToken(refreshToken)

    const newAccessToken = backendResponse.data.access_token
    if (!newAccessToken) {
      throw new Error('Access token not found in backend response')
    }

    const response = NextResponse.json(
      { access_token: newAccessToken, token_type: 'bearer' },
      { status: 200 }
    )
    response.cookies.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: Number(process.env.ACCESS_TOKEN_EXPIRE_MINUTES) * 60,
    })
    return response
  } catch (error) {
    console.error('Refresh token API error:', error)
    return NextResponse.json(
      { detail: 'Invalid or expired refresh token' },
      { status: 403 }
    )
  }
}
