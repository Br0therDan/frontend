'use client'
import React, { useEffect } from 'react'
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
  mode: 'create' | 'update'
  appName?: string
}

export default function AppForm({ mode, appName }: AppFormProps) {
  const [loading, setLoading] = useState(false)
  const [app, setApp] = useState<AppPublic | null>(null)
  const t = useTranslations()

  const fetchApp = async () => {
    setLoading(true)
    try {
      const response = await AdminService.adminReadAppByName(appName!)
      setApp(response.data)
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (mode === 'update') {
      fetchApp()
    }
  }, [])

  const methods = useForm<AppUpdate>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues:
      mode === 'create'
        ? {
            name: app?.name,
            description: app?.description,
            logo: app?.logo,
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

  const updateApp = async (data: AppUpdate) => {
    setLoading(true)
    try {
      await AdminService.adminUpdateApp(appName!, data)
      toast.success('성공!', {
        description: '앱이 성공적으로 업데이트 되었습니다.',
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

  const addApp = async (app: AppCreate) => {
    setLoading(true)
    try {
      await AdminService.adminCreateApp(app)
      toast.success('성공!', {
        description: '앱이 성공적으로 추가되었습니다.',
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

  const onSubmit: SubmitHandler<AppCreate | AppUpdate> = async (data) => {
    if (mode === 'create') {
      addApp(data as AppCreate)
    } else {
      updateApp(data as AppUpdate)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <FormProvider {...methods}>
      <Dialog>
        <DialogTrigger asChild>
        {mode === 'create' ? (
            <Button variant='default'>
              {' '}
              <PlusCircle />새 앱 추가{' '}
            </Button>
          ) : (
            <Button variant='ghost'>
              <Edit />
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className='max-w-md'>
            <DialogHeader>
              {mode === 'update' ? (
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
