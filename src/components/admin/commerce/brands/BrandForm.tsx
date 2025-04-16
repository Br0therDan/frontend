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
import { BrandService } from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'
import { useState } from 'react'
import Loading from '@/components/common/Loading'
import { BrandCreate, Brand, BrandUpdate } from '@/client/commerce'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { Edit, PlusCircle } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'

interface BrandFormProps {
  mode: 'add' | 'edit'
  brand?: Brand
  onSuccess?: () => void
}

export default function BrandForm({ mode, brand, onSuccess }: BrandFormProps) {
  const [loading, setLoading] = useState(false)
  const { activeApp } = useApp()

  const methods = useForm<BrandUpdate | BrandCreate>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues:
      mode === 'edit' && brand
        ? {
            name: brand.name,
            description: brand.description,
            logo_url: brand.logo_url,
          }
        : {
            name: '',
            description: '',
            logo_url: '',
          },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = methods

  const editBrand = async (data: BrandUpdate) => {
    setLoading(true)
    try {
      if (!brand) {
        throw new Error('Brand not found')
      }
      await  (brand._id, data)
      toast.success('성공!', {
        description: '브랜드가 성공적으로 업데이트 되었습니다.',
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

  const addBrand = async (brand: BrandCreate) => {
    setLoading(true)
    try {
      brand.app_name = activeApp?.name ?? ''
      await BrandService.brandCreateBrand(brand)
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

  const onSubmit: SubmitHandler<BrandCreate | BrandUpdate> =  (data) => {
    if (mode === 'add') {
      addBrand(data as BrandCreate)
    } else {
      editBrand(data as BrandUpdate)
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
              <PlusCircle />브랜드 추가{' '}
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
                  <DialogTitle>제품 카테고리 수정</DialogTitle>
                  <DialogDescription className='text-sm text-muted-foreground'>
                    `{brand?.name}` 카테고리를 수정합니다.
                  </DialogDescription>
                </>
              ) : (
                <>
                  <DialogTitle>
                    제품 카테고리 추가
                  </DialogTitle>
                  <DialogDescription className='text-sm text-muted-foreground'>
                    제품 카테고리를 추가합니다.
                  </DialogDescription>
                </>
              )}
            </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='grid gap-4 py-4'>
              {/* Category Name */}
              <div className='grid gap-2'>
                <Label htmlFor='name'>브랜드 이름</Label>
                <Input
                  id='name'
                  {...register('name', {
                    required: '브랜드 이름을 입력하세요 ',
                  })}
                  placeholder='브랜드 이름을 입력하세요'
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
                  placeholder='설명을 입력하세요'
                  type='text'
                />
              </div>

              {/* Logo */}
              <div className='grid gap-2'>
                <Label htmlFor='logo'>로고</Label>
                <Input
                  id='logo'
                  placeholder='로고를 입력하세요'
                  type='text'
                />
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
                저장
              </MyButton>
            </DialogFooter>
          </form>
          <DialogClose className='absolute top-4 right-4' />
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}
