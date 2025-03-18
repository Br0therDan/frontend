'use client'
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { confirmPasswordRules, passwordRules } from '@/utils/utils'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormMessage } from '@/components/ui/form'
import { MyButton } from '@/components/common/buttons/submit-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UsersService } from '@/lib/api'
import { UpdatePassword } from '@/client/iam'
import { useState } from 'react'
import Loading from '@/components/common/Loading'
import { handleApiError } from '@/lib/errorHandler'
import { useTranslations } from 'next-intl'

interface UpdatePasswordForm extends UpdatePassword {
  confirm_password: string
}

const ChangePassword = () => {
  const t = useTranslations()
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordForm>({
    mode: 'onBlur',
    criteriaMode: 'all',
  })

  const onSubmit: SubmitHandler<UpdatePasswordForm> = async (data) => {
    try {
      setLoading(true)
      const userUpdateData: UpdatePassword = {
        new_password: data.new_password,
        current_password: data.current_password,
      }
      await UsersService.usersUpdatePassword(userUpdateData)
      toast.success(t('forms.change_password.success.title'), {
        description: t('forms.change_password.success.description'),
      })
      reset()
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className='space-y-6'>
      <Card className='p-3 shadow-sm w-full space-y-2'>
        <CardHeader>
          <CardTitle className='text-xl'>
            {t('forms.change_password.title')}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className='flex flex-col space-y-6'>
            {/* Current Password */}
            <div className='flex flex-col gap-2 items-start'>
              <Label htmlFor='current_password'>
                {t('forms.change_password.current_password')}
              </Label>
              <Input
                id='current_password'
                type='password'
                placeholder='Password'
                {...register('current_password', {
                  required: 'Current password is required.',
                })}
              />
              {errors.current_password && (
                <FormMessage>{errors.current_password.message}</FormMessage>
              )}
            </div>
            {/* New Password */}
            <div className='flex flex-col gap-2 items-start'>
              <Label htmlFor='new_password'>
                {t('forms.change_password.new_password')}
              </Label>
              <Input
                id='new_password'
                type='password'
                placeholder='Password'
                {...register('new_password', passwordRules())}
              />
              {errors.new_password && (
                <FormMessage>{errors.new_password.message}</FormMessage>
              )}
            </div>
            {/* Confirm Password */}
            <div className='flex flex-col gap-2 items-start'>
              <Label htmlFor='confirm_password'>
                {t('forms.change_password.confirm_password')}
              </Label>
              <Input
                id='confirm_password'
                type='password'
                placeholder='Password'
                {...register(
                  'confirm_password',
                  confirmPasswordRules(getValues)
                )}
              />
              {errors.confirm_password && (
                <FormMessage>{errors.confirm_password.message}</FormMessage>
              )}
            </div>
            {/* Submit Button */}
            <div className='flex flex-col gap-2 p-2 items-start'>
              <MyButton
                type='submit'
                className='w-full'
                isLoading={isSubmitting}
              >
                {isSubmitting ? (
                  <span className='flex items-center justify-center'>
                    <Loader2 className='animate-spin mr-2' size={20} />
                    Please wait...
                  </span>
                ) : (
                  'Save'
                )}
              </MyButton>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}

export default ChangePassword
