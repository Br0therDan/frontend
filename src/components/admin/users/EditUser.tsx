'use client'
import React from 'react'
import {
  FormProvider,
  useForm,
  Controller,
  type SubmitHandler,
} from 'react-hook-form'
import { AdminUserUpdate, type UserPublic } from '@/client/iam'
import { toast } from 'sonner'
import { emailPattern } from '@/utils/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { MyButton } from '@/components/common/buttons/submit-button'
import { FormMessage } from '@/components/ui/form'
import { AdminService } from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'
import Loading from '@/components/common/Loading'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface EditUserProps {
  user: UserPublic
  isOpen: boolean
  onClose: () => void
}

interface AdminUserUpdateForm extends AdminUserUpdate {
  confirm_password?: string
}

export default function EditUser({ user, isOpen, onClose }: EditUserProps) {
  const t = useTranslations()
  const [loading, setLoading] = useState(false)
  const methods = useForm<AdminUserUpdateForm>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      email: user.email,
      fullname: user.fullname,
      is_superuser: user.is_superuser,
      is_active: user.is_active,
      password: '',
      confirm_password: '',
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = methods

  const edit = async (data: AdminUserUpdateForm) => {
    setLoading(true)
    try {
      await AdminService.adminUpdateUser(user._id, data)
      toast.success(t('forms.user.edit_success.title'), {
        description: t('forms.user.edit_success.description'),
      })
      onClose()
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }

  const onSubmit: SubmitHandler<AdminUserUpdateForm> = async (data) => {
    if (data.password === '') {
      data.password = undefined
    }
    edit(data)
  }

  const onCancel = () => {
    reset()
    onClose()
  }

  if (loading) {
    return <Loading />
  }

  return (
    <FormProvider {...methods}>
      <Dialog open={isOpen} onOpenChange={onClose}>
        {/* No DialogTrigger here, we open/close externally */}
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{t('forms.user.edit_title')} </DialogTitle>
              <DialogDescription className='text-sm text-muted-foreground'>
                {t('forms.user.edit_description')}
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              {/* Email */}
              <div className='grid gap-2 py-2'>
                <Label htmlFor='email'>{t('forms.user.email')}</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='Email'
                  {...register('email', {
                    // required: "Email is required",
                    pattern: emailPattern,
                  })}
                />
                {errors.email && (
                  <p className='text-sm text-red-500 mt-1'>
                    {t(errors.email.message)}
                  </p>
                )}
              </div>

              {/* Full Name */}
              <div className='grid gap-2 py-2'>
                <Label htmlFor='fullname'>{t('forms.user.fullname')}</Label>
                <Input id='fullname' type='text' {...register('fullname')} />
              </div>

              {/* Password */}
              <div className='grid gap-2 py-2'>
                <Label htmlFor='password'>{t('forms.user.password')}</Label>
                <Input
                  id='password'
                  type='password'
                  placeholder='Password'
                  {...register('password', {
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  })}
                />
                {errors.password && (
                  <FormMessage>{t(errors.password.message)}</FormMessage>
                )}
              </div>

              {/* Confirm Password */}
              <div className='grid gap-2 py-2'>
                <Label htmlFor='confirm_password'>
                  {t('forms.user.confirm_password')}
                </Label>
                <Input
                  id='confirm_password'
                  type='password'
                  placeholder='Password'
                  {...register('confirm_password', {
                    validate: (value) =>
                      value === getValues().password ||
                      'The passwords do not match',
                  })}
                />
                {errors.confirm_password && (
                  <FormMessage>
                    {t(errors.confirm_password.message)}
                  </FormMessage>
                )}
              </div>

              {/* Superuser / Active */}
              <div className='flex items-center gap-4 py-2'>
                <div className='flex items-center space-x-2'>
                  <Controller
                    name='is_superuser'
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id='is_superuser'
                        checked={field.value ?? false}
                        onCheckedChange={(checked) => field.onChange(!!checked)}
                      />
                    )}
                  />
                  <Label htmlFor='is_superuser'>
                    {t('forms.user.is_superuser')}
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Controller
                    name='is_active'
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id='is_active'
                        checked={field.value ?? false}
                        onCheckedChange={(checked) => field.onChange(!!checked)}
                      />
                    )}
                  />
                  <Label htmlFor='is_active'>{t('forms.user.is_active')}</Label>
                </div>
              </div>
            </div>
            <DialogFooter className='flex justify-end gap-2 pt-4'>
              <MyButton
                variant='outline'
                onClick={onCancel}
                disabled={isSubmitting}
                className='w-full'
                type='button'
              >
                {t('forms.user.cancel')}
              </MyButton>
              <MyButton
                variant='default'
                type='submit'
                isLoading={isSubmitting}
                className='w-full'
              >
                {t('forms.user.save')}
              </MyButton>
            </DialogFooter>
          </form>
          <DialogClose className='absolute top-4 right-4' />
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}
