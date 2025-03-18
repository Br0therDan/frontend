// 이 파일은 클라이언트 사이드 전용입니다.
import Cookies from 'js-cookie'

export const getAccessTokenClient = (): string => {
  return Cookies.get('access_token') || ''
}
