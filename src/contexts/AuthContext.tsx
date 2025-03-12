'use client'

import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
  useCallback,
} from 'react'
import { useRouter } from 'next/navigation'
import { LoginRequest, AuthContextType } from '@/types/auth'
import { AuthService, UsersService } from '@/lib/api'
import Cookies from 'js-cookie'
import { NewPassword, UserPublic } from '@/client/iam'
import { handleApiError } from '@/lib/errorHandler'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()
  const t = useTranslations()

  // refreshUser 함수 추가: 사용자 데이터를 다시 불러옴
  const refreshUser = useCallback(async () => {
    try {
      setLoading(true)
      const response = await UsersService.usersReadUserMe()
      if (response.data) {
        setUser(response.data)
      } else {
        await handleLogout()
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { detail?: string } }; message: string })
          .response?.data?.detail || (err as { message: string }).message
      setError(errorMsg)
      handleApiError(err, (message) => toast.error(message.title))
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      try {
        const response = await UsersService.usersReadUserMe()
        if (response.data) {
          setUser(response.data)
        } else {
          await handleLogout()
        }
      } catch (err) {
        const errorMsg =
          (
            err as {
              response?: { data?: { detail?: string } }
              message: string
            }
          ).response?.data?.detail || (err as { message: string }).message
        setError(errorMsg)
        await handleLogout()
        handleApiError(err, (message) => toast.error(message.title))
      } finally {
        setLoading(false)
      }
    }

    const token = Cookies.get('access_token')
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [router])

  const handleLogout = async () => {
    try {
      await AuthService.authLogout()
    } catch (err) {
      const errorMsg =
        (err as { response?: { data?: { detail?: string } }; message: string })
          .response?.data?.detail || (err as { message: string }).message
      setError(errorMsg)
      handleApiError(err, (message) => toast.error(message.title))
    } finally {
      Cookies.remove('access_token')
      Cookies.remove('token_type')
      setUser(null)
      router.push('/auth/login')
    }
  }

  const login = async (data: LoginRequest, redirectPath?: string) => {
    setLoading(true)
    try {
      const response = await AuthService.authLoginAccessToken(
        data.username,
        data.password
      )

      Cookies.set('access_token', response.data.access_token)
      if (response.data.refresh_token) {
        Cookies.set('refresh_token', response.data.refresh_token)
      }

      const userResponse = await UsersService.usersReadUserMe()
      setUser(userResponse.data)

      toast.success(t('forms.login.success.title'), {
        description: t('forms.login.success.description'),
      })

      router.push(redirectPath || '/main')
    } catch (err) {
      const errorMsg =
        (err as { response?: { data?: { detail?: string } }; message: string })
          .response?.data?.detail || (err as { message: string }).message
      setError(errorMsg)
      handleApiError(err, (message) => toast.error(message.title))
    } finally {
      setLoading(false)
    }
  }

  const forgotPassword = async (email: string) => {
    setLoading(true)
    try {
      await AuthService.authRecoverPassword(email)
      toast.success(t('forms.forgot_password.success.title'), {
        description: t('forms.forgot_password.success.description'),
      })
    } catch (err) {
      const errorMsg =
        (err as { response?: { data?: { detail?: string } }; message: string })
          .response?.data?.detail || (err as { message: string }).message
      setError(errorMsg)
      handleApiError(err, (message) => toast.error(message.title))
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (data: NewPassword) => {
    setLoading(true)
    try {
      await AuthService.authResetPassword(data)
      toast.success(t('forms.reset_password.success.title'), {
        description: t('forms.reset_password.success.description'),
      })
      router.push('/auth/login')
    } catch (err) {
      const errorMsg =
        (err as { response?: { data?: { detail?: string } }; message: string })
          .response?.data?.detail || (err as { message: string }).message
      setError(errorMsg)
      handleApiError(err, (message) => toast.error(message.title))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        loading,
        login,
        logout: handleLogout,
        forgotPassword,
        resetPassword,
        refreshUser, // 추가된 refreshUser 함수
        resetError: () => setError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
