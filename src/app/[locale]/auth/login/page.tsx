'use client'

import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { emailPattern, passwordRules } from '@/utils/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { OAuthLoginButton } from '@/components/auth/OAuthLoginButton'
// import Loading from '@/components/common/Loading'
import { LoginRequest } from '@/types/auth'
import { MyLogo, MyLogoDark } from '@/components/common/brand/logo'
import { useTranslations } from 'next-intl'

export default function LoginPage() {
  const { login } = useAuth()
  // const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirectPath')
  const t = useTranslations()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    mode: 'onBlur',
    defaultValues: { username: '', password: '' },
  })

  // useEffect(() => {
  //   if (user) router.push(redirectPath || '/main')
  // }, [user, router, redirectPath])

  const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
    if (isSubmitting) return
    await login({ ...data, redirectPath: redirectPath || '/main' })
  }


  return (
    <div className='flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10'>
      <div className='flex w-full max-w-sm flex-col gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-2xl font-bold'>
              <div className='relative'>
                <MyLogo className='size-10' />
                <MyLogoDark className='size-10' />
              </div>
              {t('forms.login.title')}
            </CardTitle>
            <CardDescription>{t('forms.login.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='grid gap-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='email'>{t('user.email')}</Label>
                  <Input
                    id='username'
                    {...register('username', {
                      required: t('errors.auth.email_required'),
                      pattern: emailPattern,
                    })}
                    placeholder={t('user.email')}
                    type='email'
                    className={errors.username ? 'border-red-500' : ''}
                  />
                  {errors.username && (
                    <p className='text-sm text-red-500'>
                      {t(errors.username.message)}
                    </p>
                  )}
                </div>
                <div className='grid gap-2'>
                  <div className='flex items-center'>
                    <Label htmlFor='password'>{t('user.password')}</Label>
                    <Link
                      href='/auth/forgot-password'
                      className='ml-auto inline-block text-xs underline'
                    >
                      {t('forms.login.forgot_password')}
                    </Link>
                  </div>
                  <Input
                    id='password'
                    {...register('password', passwordRules())}
                    type='password'
                    placeholder={t('user.password')}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && (
                    <p className='text-sm text-red-500'>
                      {t(errors.password.message as string)}
                    </p>
                  )}
                </div>

                <Button type='submit' variant='default' className='w-full'>
                  {t('forms.login.submit')}
                </Button>
                <div className='flex justify-center mt-4 text-center gap-2 text-xs'>
                  {t('forms.login.no_account')}
                  <Link href='/auth/signup' className='underline text-blue-600'>
                    {t('forms.login.signup')}
                  </Link>
                </div>
              </div>
              <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
                <span className='relative z-10 text-xs bg-background px-2 text-muted-foreground'>
                  {t('forms.login.continue_with')}
                </span>
              </div>
              <div className='grid gap-2'>
                <OAuthLoginButton provider='google' />
                <OAuthLoginButton provider='kakao' />
                <OAuthLoginButton provider='naver' />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
