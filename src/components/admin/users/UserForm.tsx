'use client'
import React from 'react'
import {
  FormProvider,
  useForm,
  Controller,
  type SubmitHandler,
} from 'react-hook-form'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  // DialogFooter,
  DialogClose,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox' // If you generated a ShadCN Checkbox
import { MyButton } from '@/components/common/buttons/submit-button' // Custom ShadCN-based button
import { UserPublic, type AdminUserCreate } from '@/client/iam'
import { emailPattern, namePattern, passwordRules } from '@/utils/utils'
import { toast } from 'sonner'
import { AdminService } from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'
import { useState } from 'react'
import Loading from '@/components/common/Loading'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Edit, PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'

interface UserFormProps {
  mode: 'add' | 'edit'
  user?: UserPublic
}

interface UserForm extends AdminUserCreate {
  confirm_password?: string
}

export default function UserForm({ mode, user }: UserFormProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const t = useTranslations()
  const router = useRouter()
  const { activeApp } = useApp()
  const methods = useForm<UserForm>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues:
      mode === 'edit'
        ? {
            email: user?.email,
            fullname: user?.fullname,
            is_superuser: user?.is_superuser,
            is_active: user?.is_active,
          }
        : {
            email: '',
            password: '',
            fullname: '',
            confirm_password: '',
            is_superuser: false,
            is_active: false,
          },
  })

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = methods

  const add = async (data: AdminUserCreate) => {
    setLoading(true)
    try {
      await AdminService.adminCreateUser(data)
      toast.success(t('forms.user.add_success'), {
        description: t('forms.user.add_success.description'),
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

  const edit = async (data: UserForm) => {
    setLoading(true)
    try {
      if (mode === 'edit' && user) {
        await AdminService.adminUpdateUser(user._id, data)
        toast.success(t('forms.user.edit_success.title'), {
          description: t('forms.user.edit_success.description'),
        })
      }
      router.push(`/admin/${activeApp?.name}/users`)
      reset()
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }

  const onSubmit: SubmitHandler<UserForm> = (data) => {
    if (mode === 'edit') {
      edit(data)
    } else {
      add(data)
    }
    window.location.reload()
  }

  if (loading) {
    return <Loading />
  }

  return (
    <FormProvider {...methods}>
      <Dialog>
        <DialogTrigger asChild>
          {/* Add User */}
          {mode === 'add' ? (
            <Button variant='default'>
              {' '}
              <PlusCircle /> Add User{' '}
            </Button>
          ) : (
            <Button variant='ghost'>
              <Edit />
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              {mode === 'edit' ? (
                <>
                  <DialogTitle>{t('pages.admin.users.edit.title')}</DialogTitle>
                  <DialogDescription className='text-sm text-muted-foreground'>
                    {t('pages.admin.users.edit.description')}
                  </DialogDescription>
                </>
              ) : (
                <>
                  <DialogTitle>
                    {t('pages.admin.users.create.title')}
                  </DialogTitle>
                  <DialogDescription className='text-sm text-muted-foreground'>
                    {t('pages.admin.users.create.description')}
                  </DialogDescription>
                </>
              )}
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              {/* Email */}
              <div className='grid gap-2'>
                <Label htmlFor='email'>{t('user.email')}</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='Email'
                  {...register('email', {
                    required: t('errors.auth.email_required'),
                    pattern: emailPattern,
                  })}
                />
                {errors.email && (
                  <p className='text-sm text-red-500'>
                    {t(errors.email.message)}
                  </p>
                )}
              </div>

              {/* Full name */}
              <div className='grid gap-2'>
                <Label htmlFor='full_name'>{t('user.fullname')}</Label>
                <Input
                  id='full_name'
                  type='text'
                  placeholder='Full name'
                  {...register('fullname', {
                    required: t('errors.auth.fullname_required'),
                    pattern: namePattern,
                  })}
                />
                {errors.fullname && (
                  <p className='text-sm text-red-500'>
                    {t(errors.fullname.message)}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className='grid gap-1.5'>
                <Label htmlFor='password'>{t('user.password')}</Label>
                <Input
                  id='password'
                  type='password'
                  placeholder='Password'
                  {...register('password', passwordRules())}
                />
                {errors.password && (
                  <p className='text-sm text-red-500'>
                    {t(errors.password.message)}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className='grid gap-2'>
                <Label htmlFor='confirm_password'>
                  {t('user.confirm_password')}
                </Label>
                <Input
                  id='confirm_password'
                  type='password'
                  placeholder='Confirm Password'
                  {...register('confirm_password', passwordRules())}
                />
                {errors.confirm_password && (
                  <p className='text-sm text-red-500'>
                    {t(errors.confirm_password.message)}
                  </p>
                )}
              </div>

              {/* Superuser / Active */}
              <div className='flex items-center gap-4'>
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
                  <Label htmlFor='is_superuser'>{t('user.is_superuser')}</Label>
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
                  <Label htmlFor='is_active'>{t('user.is_active')}</Label>
                </div>
              </div>
            </div>

            <DialogFooter className='flex justify-end gap-3 pt-2'>
              <MyButton
                variant='default'
                type='submit'
                isLoading={isSubmitting}
                disabled={!isDirty}
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
