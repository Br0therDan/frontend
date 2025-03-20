import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { OAuthService } from '@/lib/api'

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } } // provider를 required로 지정
) {
  const { provider } = params
  const url = request.nextUrl
  const code = url.searchParams.get('code') ?? ''
  const state = url.searchParams.get('state') ?? ''
  const redirectPath = url.searchParams.get('redirectPath') ?? ''

  try {
    const response = await OAuthService.oAuth2OauthCallback(provider, code, state)

    if (response.status === 200) {
      const cookieStore = await cookies()
      cookieStore.set('access_token', response.data.access_token)
      if (response.data.refresh_token) {
        cookieStore.set('refresh_token', response.data.refresh_token)
      }
      if (redirectPath) {
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_SITE_URL}${redirectPath}`
        )
      }
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/main`)
    } else {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/auth/login`)
    }
  } catch (err) {
    console.error('OAuth callback error:', err)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/auth/login`)
  }
}
