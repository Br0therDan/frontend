'use client'
import React from 'react'
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form'

import { toast } from 'sonner'
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
import { Label } from '@/components/ui/label'
import { FormMessage } from '@/components/ui/form'
import { MyButton } from '@/components/common/buttons/submit-button'
import { AdminService } from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'
import { useState } from 'react'
import Loading from '@/components/common/Loading'
import { AppCreate, AppPublic, AppUpdate } from '@/client/iam'
import { useTranslations } from 'next-intl'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { Edit, PlusCircle } from 'lucide-react'

interface AppFormProps {
  mode: 'add' | 'edit'
  app?: AppPublic
  onSuccess?: () => void
}

export default function AppForm({ mode, app, onSuccess }: AppFormProps) {
  const [loading, setLoading] = useState(false)
  const t = useTranslations()

  const methods = useForm<AppUpdate>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues:
      mode === 'edit' && app
        ? {
            name: app.name,
            description: app.description,
            logo: app.logo,
          }
        : {
            name: '',
            description: '',
            logo: '',
          },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = methods

  const editApp = async (data: AppUpdate) => {
    setLoading(true)
    try {
      if (!app) {
        throw new Error('App not found')
      }
      await AdminService.adminUpdateApp(app._id, data)
      toast.success('성공!', {
        description: '앱이 성공적으로 업데이트 되었습니다.',
      })
      onSuccess?.()
      reset()
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }

  const addApp = async (app: AppCreate) => {
    setLoading(true)
    try {
      await AdminService.adminCreateApp(app)
      toast.success('성공!', {
        description: '앱이 성공적으로 추가되었습니다.',
      })
      onSuccess?.()
      reset()
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }

  const onSubmit: SubmitHandler<AppCreate | AppUpdate> =  (data) => {
    if (mode === 'add') {
      addApp(data as AppCreate)
    } else {
      editApp(data as AppUpdate)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <FormProvider {...methods}>
      <Dialog>
        <DialogTrigger asChild>
        {mode === 'add' ? (
            <Button variant='default' className='w-full'>
              {' '}
              <PlusCircle />새 앱 추가{' '}
            </Button>
          ) : (
            <Button variant='ghost'>
              <Edit />
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className='max-w-md z-3000'>
            <DialogHeader>
              {mode === 'edit' ? (
                <>
                  <DialogTitle>{t('pages.admin.apps.edit.title')}</DialogTitle>
                  <DialogDescription className='text-sm text-muted-foreground'>
                    {t('pages.admin.apps.edit.description')}
                  </DialogDescription>
                </>
              ) : (
                <>
                  <DialogTitle>
                    {t('pages.admin.apps.create.title')}
                  </DialogTitle>
                  <DialogDescription className='text-sm text-muted-foreground'>
                    {t('pages.admin.apps.create.description')}
                  </DialogDescription>
                </>
              )}
            </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='grid gap-4 py-4'>
              {/* Category Name */}
              <div className='grid gap-2'>
                <Label htmlFor='name'>앱 이름</Label>
                <Input
                  id='name'
                  {...register('name', {
                    required: '앱 이름을 입력하세요 ',
                  })}
                  placeholder='앱 이름을 입력하세요'
                  type='text'
                />
                {errors.name && (
                  <FormMessage>{errors.name.message}</FormMessage>
                )}
              </div>

              {/* Description */}
              <div className='grid gap-2'>
                <Label htmlFor='description'>설명</Label>
                <Input
                  id='description'
                  {...register('description', {
                    required: '설명을 입력하세요 ',
                  })}
                  placeholder='설명을 입력하세요'
                  type='text'
                />
                {errors.description && (
                  <FormMessage>{errors.description.message}</FormMessage>
                )}
              </div>

              {/* Logo */}
              <div className='grid gap-2'>
                <Label htmlFor='logo'>로고</Label>
                <Input
                  id='logo'
                  {...register('logo', {
                    required: '로고를 입력하세요 ',
                  })}
                  placeholder='로고를 입력하세요'
                  type='text'
                />
                {errors.logo && (
                  <FormMessage>{errors.logo.message}</FormMessage>
                )}
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
                {t('forms.create_category.submit')}
              </MyButton>
            </DialogFooter>
          </form>
          <DialogClose className='absolute top-4 right-4' />
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}
