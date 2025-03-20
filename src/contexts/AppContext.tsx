"use client"

import { AppPublic } from '@/client/iam'
import { AppsService } from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { toast } from 'sonner'
import Cookies from 'js-cookie'

interface AppContextType {
  apps: AppPublic[]
  loading: boolean
  fetchApps: () => Promise<void>
  activeApp: AppPublic | undefined
  setActiveApp: React.Dispatch<React.SetStateAction<AppPublic | undefined>>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [apps, setApps] = useState<AppPublic[]>([])
  const [activeApp, setActiveApp] = useState<AppPublic | undefined>(undefined)

  /**
   * 1. 앱 목록을 불러오는 함수
   */
  const fetchApps = useCallback(async () => {
    setLoading(true)
    try {
      const response = await AppsService.appsReadApps()
      setApps(response.data)
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * 2. 마운트 시점:
   *    - fetchApps()로 앱 목록을 불러오기
   *    - 쿠키에서 activeApp 복원
   */
  useEffect(() => {
    const init = async () => {
      // 우선 쿠키 체크
      const stored = Cookies.get('activeApp')
      if (stored) {
        try {
          const parsed: AppPublic = JSON.parse(stored)
          setActiveApp(parsed)
        } catch (error) {
          console.error("Error parsing stored activeApp:", error)
        }
      }

      // apps fetch
      await fetchApps()
    }

    init()
  }, [fetchApps])

  /**
   * 3. apps가 업데이트되면(즉, fetchApps 후),
   *    만약 activeApp이 없는 상태라면(쿠키 없거나 파싱 에러),
   *    apps 배열의 첫 번째 앱을 default activeApp으로 설정
   */
  useEffect(() => {
    // 쿠키에 activeApp이 없거나 파싱 실패로 activeApp이 설정되지 않았다면
    if (!activeApp && apps.length > 0) {
      // 첫 번째 앱을 기본값으로 설정
      const defaultApp = apps[0]
      setActiveApp(defaultApp)
      Cookies.set('activeApp', JSON.stringify(defaultApp))
    }
  }, [activeApp, apps])

  /**
   * 4. activeApp이 바뀔 때마다 쿠키 업데이트 (선택사항)
   *    - 이미 위에서 쿠키를 세팅했으므로, 추가로 해주고 싶으면 다음 로직을 유지
   */
  useEffect(() => {
    if (activeApp) {
      Cookies.set('activeApp', JSON.stringify(activeApp))
    }
  }, [activeApp])

  return (
    <AppContext.Provider
      value={{
        apps,
        loading,
        fetchApps,
        activeApp,
        setActiveApp,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
