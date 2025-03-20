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

// Context 타입
interface AppContextType {
  apps: AppPublic[]
  loading: boolean
  fetchApps: (force?: boolean) => Promise<void>
  activeApp: AppPublic | undefined
  setActiveApp: React.Dispatch<React.SetStateAction<AppPublic | undefined>>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [apps, setApps] = useState<AppPublic[]>([])
  const [activeApp, setActiveApp] = useState<AppPublic | undefined>(undefined)

  /**
   * 1) apps 목록 가져오기 - "force"가 아닌 이상 쿠키 우선
   */
  const fetchApps = useCallback(async (force = false) => {
    // 쿠키에 이미 있으면 바로 파싱 + 로딩 끝
    const storedApps = Cookies.get('apps')
    if (storedApps && !force) {
      try {
        const parsedApps: AppPublic[] = JSON.parse(storedApps)
        setApps(parsedApps)
        setLoading(false)
        return
      } catch (err) {
        handleApiError(err, (message) =>
          toast.error(message.title, { description: message.description })
        )
        Cookies.remove('apps')
      }
    }

    // 여기 오면 쿠키가 없거나(force=true) 하므로 서버 Fetch
    setLoading(true)
    try {
      const response = await AppsService.appsReadApps()
      setApps(response.data)

      // 서버에서 받은 apps를 쿠키에 저장
      Cookies.set('apps', JSON.stringify(response.data))
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * 2) 마운트 시점:
   *   - 쿠키에서 activeApp(전체 객체) 복원
   *   - apps 목록 fetch (쿠키 우선)
   */
  useEffect(() => {
    const init = async () => {
      // 쿠키에서 activeApp 불러오기
      const stored = Cookies.get('activeApp')
      if (stored) {
        try {
          const parsed: AppPublic = JSON.parse(stored)
          setActiveApp(parsed)
        } catch (error) {
          console.error("Error parsing stored activeApp:", error)
        }
      }
      // 쿠키에 apps 있으면 바로 setApps, 없으면 서버 fetch
      await fetchApps(/* force= */ false)
    }
    init()
  }, [fetchApps])

  /**
   * 3) apps가 로드된 뒤, activeApp이 없다면 → 첫 번째 앱 선택
   */
  useEffect(() => {
    if (!activeApp && apps.length > 0) {
      const defaultApp = apps[0]
      setActiveApp(defaultApp)
      Cookies.set('activeApp', JSON.stringify(defaultApp))
    }
  }, [apps, activeApp])

  /**
   * 4) activeApp이 바뀔 때마다 쿠키에 반영
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
