'use client'
import React from 'react'

import { type SubmitHandler, useForm } from 'react-hook-form'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { emailPattern } from '@/utils/utils'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { handleApiError } from '@/lib/errorHandler'
import { useTranslations } from 'next-intl'
import { MyLogo, MyLogoDark } from '@/components/common/brand/logo'

interface ForgotPasswordForm {
  email: string
}

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>()


  const { forgotPassword } = useAuth()
  const t = useTranslations()

  const onSubmit: SubmitHandler<ForgotPasswordForm> = async ({ email }) => {
    if (isSubmitting) return
    try {
      await forgotPassword(email)
      toast.success(t('forms.forgot_password.success.title'), {
        description: t('forms.forgot_password.success.description'),
      })
      reset()
    } catch (err) {
      handleApiError(err, (message) => toast.error(message.title))
    }
  }

  return (
    <div className='flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10'>
      <div className='flex w-full max-w-sm flex-col gap-6'>
        <Card className='w-full max-w-md p-6'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-2xl font-bold'>
              <div className='relative'>
                <MyLogo className='size-10' />
                <MyLogoDark className='size-10' />
              </div>
              {t('forms.forgot_password.title')}
            </CardTitle>
            <CardDescription>
              {t('forms.forgot_password.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-4'>
                <Input
                  id='email'
                  {...register('email', {
                    required: t('errors.auth.email_required'),
                    pattern: emailPattern,
                  })}
                  placeholder={t('user.email')}
                  type='email'
                />
                {errors && (
                  <p className='text-sm text-red-500'>
                    {t(errors.email?.message)}
                  </p>
                )}
              </div>
              <div className='flex gap-2 w-full'>
                {/* <Button
                  variant='outline'
                  onClick={() => router.push('/auth/login')}
                >
                  {t('forms.forgot_password.back_to_login')}
                </Button> */}
                <Button type='submit' className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className='animate-spin' />
                      Please wait...
                    </>
                  ) : (
                    t('forms.forgot_password.submit')
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
