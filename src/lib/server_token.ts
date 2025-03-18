// 이 파일은 SSR 전용입니다.
import { cookies } from 'next/headers'

export const getAccessTokenSSR = async (): Promise<string> => {
  const cookieStore = await cookies()
  return cookieStore.get('access_token')?.value || ''
}
