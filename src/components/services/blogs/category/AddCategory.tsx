'use client'
import React from 'react'
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form'
import { CategoryCreate } from '@/client/posts'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogOverlay,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormMessage } from '@/components/ui/form'
import { MyButton } from '@/components/common/buttons/submit-button'
import { PlusCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryService } from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'
import { useState } from 'react'
import Loading from '@/components/common/Loading'
import { useTranslations } from 'next-intl'

interface AddCategoryProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddCategory({ isOpen, onClose }: AddCategoryProps) {
  const [loading, setLoading] = useState(false)
  const t = useTranslations()
  const methods = useForm<CategoryCreate>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      name: '',
      subcategories: [],
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = methods

  const subcategories = watch('subcategories')

  const onSubmit: SubmitHandler<CategoryCreate> = async (data) => {
    setLoading(true)
    try {
      await CategoryService.categoriesCreateCategory(data)
      toast.success(t('forms.create_category.success.title'), {
        description: t('forms.create_category.success.description'),
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

  const handleCancel = () => {
    reset()
    onClose()
  }

  const handleAddSubcategory = () => {
    setValue('subcategories', [...(subcategories || []), ''])
  }

  const handleRemoveSubcategory = (index: number) => {
    const newSubcategories = [...(subcategories || [])]
    newSubcategories.splice(index, 1)
    setValue('subcategories', newSubcategories)
  }

  if (loading) {
    return <Loading />
  }

  return (
    <FormProvider {...methods}>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogOverlay />
        <DialogContent className='max-w-md '>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle className='text-2xl'>
                {t('forms.create_category.title')}
              </DialogTitle>
              <DialogDescription>
                {t('forms.create_category.description')}
              </DialogDescription>
            </DialogHeader>

            <div className='grid gap-4 py-4'>
              {/* Category Name */}
              <div className='grid gap-2'>
                <Label htmlFor='name'>
                  {t('forms.create_category.cat_lable')}
                </Label>
                <Input
                  id='name'
                  {...register('name', {
                    required: '카테고리 이름은 필수입니다 ',
                  })}
                  placeholder={t('forms.create_category.cat_placeholder')}
                  type='text'
                />
                {errors.name && (
                  <FormMessage>{errors.name.message}</FormMessage>
                )}
              </div>

              {/* Subcategories */}
              <div className='grid gap-2'>
                <Label htmlFor='subcategories'>
                  {t('forms.create_category.subcat_label')}
                </Label>
                {subcategories?.map((subcategory, index) => (
                  <div key={index} className='flex items-center gap-2'>
                    <Input
                      {...register(`subcategories.${index}`)}
                      placeholder={t(
                        'forms.create_category.subcat_placeholder'
                      )}
                      type='text'
                      value={subcategory}
                    />
                    <Button
                      type='button'
                      variant={'outline'}
                      onClick={() => handleRemoveSubcategory(index)}
                      className='text-sm'
                    >
                      <Trash2 className='h-5 w-5' />
                    </Button>
                  </div>
                ))}
                <Button
                  type='button'
                  variant={'outline'}
                  onClick={handleAddSubcategory}
                  className='mt-2 text-sm'
                >
                  <PlusCircle className='h-5 w-5' />
                </Button>
              </div>
            </div>

            <DialogFooter className='flex justify-end gap-3 pt-2'>
              <MyButton
                variant='outline'
                onClick={handleCancel}
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
          <DialogClose className='absolute top-4 right-4' />
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}
