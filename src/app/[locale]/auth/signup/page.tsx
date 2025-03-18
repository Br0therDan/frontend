/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { type SubmitHandler, useForm } from 'react-hook-form'
import type { UserRegister } from '@/client/iam'
import {
  confirmPasswordRules,
  emailPattern,
  passwordRules,
} from '@/utils/utils'
import { MyLogo, MyLogoDark } from '@/components/common/brand/logo'
import Link from 'next/link'
import { toast } from 'sonner'
import { useState } from 'react'
import { AuthService } from '@/lib/api'
import Loading from '@/components/common/Loading'
import { useTranslations } from 'next-intl'
import { handleApiError } from '@/lib/errorHandler'

interface UserRegisterForm extends UserRegister {
  confirm_password: string
}

export default function SignUp() {
  const t = useTranslations()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UserRegisterForm>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      email: '',
      password: '',
      confirm_password: '',
    },
  })

  const onSubmit: SubmitHandler<UserRegisterForm> = async (signupData) => {
    if (isSubmitting) return
    setLoading(true)
    try {
      await AuthService.authRegisterUser(signupData)
      // toast({
      //   title: t('forms.signup.success.title'),
      //   description: t('forms.signup.success.description'),
      // });
      toast.success(t('forms.signup.success.title'), {
        description: t('forms.signup.success.description'),
      })
      window.location.href = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/login`
    } catch (err) {
      setError((err as any).response?.data?.detail)
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }

  // 로딩 상태
  if (loading) {
    return <Loading />
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
              {t('forms.signup.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant='destructive' className='mb-4'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='grid gap-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='email'>{t('user.email')}</Label>
                  <Input
                    id='email'
                    {...register('email', {
                      required: t('errors.auth.email_required'),
                      pattern: emailPattern,
                    })}
                    placeholder={t('user.email')}
                    type='email'
                  />
                  {errors.email && (
                    <p className='text-sm text-red-500'>
                      {t(errors.email.message)}
                    </p>
                  )}
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='password'>{t('user.password')}</Label>
                  <Input
                    id='password'
                    {...register('password', passwordRules())}
                    placeholder={t('user.password')}
                    type='password'
                    required
                  />
                  {errors.password && (
                    <p className='text-sm text-red-500'>
                      {t(errors.password.message)}
                    </p>
                  )}
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='confirmPassword'>
                    {t('user.confirm_password')}
                  </Label>
                  <Input
                    id='confirm_password'
                    {...register(
                      'confirm_password',
                      confirmPasswordRules(getValues)
                    )}
                    placeholder={t('user.confirm_password')}
                    type='password'
                    required
                  />
                  {errors.confirm_password && (
                    <p className='text-sm text-red-500'>
                      {t(errors.confirm_password.message)}
                    </p>
                  )}
                </div>
                <Button type='submit' className='w-full'>
                  {t('forms.signup.submit')}
                </Button>
                <div className='flex justify-center gap-2 mt-4 text-center text-sm'>
                  {t('forms.signup.already_have_account')}
                  <Link
                    href='/auth/login'
                    className='underline underline-offset-4'
                  >
                    {t('forms.signup.login')}
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
