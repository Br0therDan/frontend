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
  // DialogOverlay,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormMessage } from '@/components/ui/form'
import { MyButton } from '@/components/common/buttons/submit-button'
import { AppsService } from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'
import { useState } from 'react'
import Loading from '@/components/common/Loading'
import { AppCreate } from '@/client/docs'
import { useTranslations } from 'next-intl'

interface AddAppProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddApp({isOpen, onClose }: AddAppProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const t = useTranslations()

  const methods = useForm<AppCreate>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues:{
      name: '',
      description: '',
      logo: '',
    }
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = methods

  const addApp = async (data: AppCreate) => {
    setLoading(true)
    try {
      await AppsService.appsCreateApp(data)
      toast.success('성공!', {
        description: '앱이 성공적으로 추가되었습니다.',
      })
      reset()
      onClose()
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }

  const onSubmit: SubmitHandler<AppCreate> = async (data) => {
    addApp(data)
  }

  const onCancel = () => {
    reset()
    onClose()
  }

  if (loading) {
    return <Loading />
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>새 앱 추가</DialogTitle>
          <DialogDescription>신규 애플리케이션을 추가합니다.</DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
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
                variant='outline'
                onClick={onCancel}
                disabled={isSubmitting}
                className='w-full'
                type='button'
              >
                {t('forms.create_category.cancel')}
              </MyButton>
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
        </FormProvider>
        <DialogClose className='absolute top-4 right-4' />
      </DialogContent>
    </Dialog>
  )
}
