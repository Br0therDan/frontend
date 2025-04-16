'use client'
import React, { useEffect } from 'react'
import {
  useForm,
  SubmitHandler,
  FormProvider,
  Controller,
} from 'react-hook-form'

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
import { ProductCategoryService } from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'
import { useState } from 'react'
import Loading from '@/components/common/Loading'
import { CategoryCreate, CategoryUpdate, Category } from '@/client/commerce'
// import { useTranslations } from 'next-intl'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { Edit, PlusCircle } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { Select, SelectContent, SelectTrigger } from '@radix-ui/react-select'
import { SelectGroup, SelectItem, SelectValue } from '@/components/ui/select'

interface CategoryFormProps {
  mode: 'add' | 'edit'
  category?: Category
  onSuccess?: () => void
}

export default function CategoryForm({
  mode,
  category,
  onSuccess,
}: CategoryFormProps) {
  const [loading, setLoading] = useState(false)
  // const t = useTranslations()
  const { activeApp } = useApp()
  const [categories, setCategories] = useState<Category[]>([])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await ProductCategoryService.categoryReadCategories(
        activeApp ? activeApp.name : ''
      )
      return response.data
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
    setCategories(categories)
  }, [])

  const methods = useForm<CategoryUpdate | CategoryCreate>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues:
      mode === 'edit' && category
        ? {
            name: category.name,
            description: category.description,
            parent_id: category.parent_id ? String(category.parent_id) : '',
          }
        : {
            name: '',
            description: '',
            parent_id: '',
            app_name: '',
          },
  })

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = methods


  const editCategory = async (data: CategoryUpdate) => {
    setLoading(true)
    try {
      if (!category) {
        throw new Error('Category not found')
      }
      await ProductCategoryService.categoryUpdateCategory(category._id!, data)
      toast.success('성공!', {
        description: `'${category.name}' 카테고리가 성공적으로 업데이트 되었습니다.`,
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

  const addCategory = async (category: CategoryCreate) => {
    setLoading(true)
    try {
      category.app_name = activeApp?.name ?? ''
      await ProductCategoryService.categoryCreateCategory(category)
      toast.success('제품 카테고리 추가', {
        description: `'${category.name}' 카테고리가 성공적으로 추가되었습니다.`,
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

  const onSubmit: SubmitHandler<CategoryCreate | CategoryUpdate> = (data) => {
    if (mode === 'add') {
      addCategory(data as CategoryCreate)
    } else {
      editCategory(data as CategoryUpdate)
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
              <PlusCircle />새 카테고리 추가{' '}
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
                <DialogTitle>카테고리 수정</DialogTitle>
                <DialogDescription className='text-sm text-muted-foreground'>
                  `{category?.name}` 카테고리를 수정합니다.
                </DialogDescription>
              </>
            ) : (
              <>
                <DialogTitle>새 카테고리 추가</DialogTitle>
                <DialogDescription className='text-sm text-muted-foreground'>
                  카테고리를 추가합니다.
                </DialogDescription>
              </>
            )}
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='grid gap-4 py-4'>
              {/* Category Name */}
              <div className='grid gap-2'>
                <Label htmlFor='name'>카테고리 이름</Label>
                <Input
                  id='name'
                  {...register('name', {
                    required: '카테고리 이름을 입력하세요 ',
                  })}
                  placeholder='카테고리 이름을 입력하세요'
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

              {/* 상위 카테고리 선택 */}
              <div className='grid gap-2'>
                <Label htmlFor='parent_id'>상위 카테고리</Label>
                <Controller
                  name='parent_id'
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <SelectTrigger className='text-sm w-48'>
                        <SelectValue placeholder='상위 카테고리 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories.map((category) => (
                            <SelectItem
                              key={category._id}
                              value={category._id || ''}
                            >
                              {category.name || '상위 카테고리 없음'}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
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
