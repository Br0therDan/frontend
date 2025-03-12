import { AuthService } from '@/lib/api'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')
  if (!token) {
    return NextResponse.error()
  }
  try {
    const response = await AuthService.authVerifyEmail(token)
    const accessToken = response.data.access_token
    const refresh_token = response.data.refresh_token
    const cookieStore = await cookies()
    cookieStore.set('access_token', accessToken)
    if (refresh_token) {
      cookieStore.set('refresh_token', refresh_token)
    }
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/main/settings`
    )
  } catch {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/auth/login`
    )
  }
}
