'use client'
import React from 'react'
import {
  useForm,
  SubmitHandler,
  Controller,
  FormProvider,
} from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DocsCategoryPublic,
  DocumentCreate,
  DocumentPublic,
  DocumentUpdate,
} from '@/client/docs'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { FormMessage } from '@/components/ui/form'
import { MyButton } from '@/components/common/buttons/submit-button'
import { CatService, DocsService } from '@/lib/api'
import QuillEditor from '@/components/common/editor/QuillEditor'
import 'react-quill/dist/quill.snow.css'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import Loading from '@/components/common/Loading'
import { handleApiError } from '@/lib/errorHandler'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DocumentFormProps {
  initialData?: DocumentPublic
  isOpen: boolean
  onClose: () => void
  mode: 'add' | 'edit'
}

export default function DocumentForm({
  initialData,
  isOpen,
  onClose,
  mode,
}: DocumentFormProps) {
  const [loading, setLoading] = useState(false)
  const t = useTranslations()

  const methods = useForm<DocumentUpdate>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues:
      mode === 'edit'
        ? {
            ...initialData,
            // 초기 데이터가 존재하는 경우, category 선택값은 빈 배열로 처리하거나
            // 별도로 변환하여 넣어줘야 합니다.
            category_id: initialData?.category?._id || '',
            subcategory_id: initialData?.subcategory?._id || '',
          }
        : {
            title: '',
            content: '',
            is_public: false,
            category_id: '',
            subcategory_id: '',
          },
  })

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = methods

  // 카테고리 목록 상태 (CategoryPublic에는 id, name, subcat 필드가 있음)
  const [categories, setCategories] = useState<DocsCategoryPublic[]>([])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await CatService.categoriesReadDocsCategory()
      const categories = response.data
      return categories
    } catch (err) {
      handleApiError(err, (message) => toast.error(message.title))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchCategoriesData = async () => {
      const res = await fetchCategories()
      if (res) {
        setCategories(res)
      }
    }
    fetchCategoriesData()
  }, [])

  const selectedCategoryId = watch('category_id')
  const selectedCategory = categories.find(
    (cat) => cat._id === selectedCategoryId
  )
  const subcategories = selectedCategory?.subcategories || []

  const add = async (doc: DocumentCreate) => {
    setLoading(true)
    try {
      await DocsService.docsCreateDocument(doc)
      toast.success(t('forms.create_doc.success.title'), {
        description: t('forms.create_doc.success.description'),
      })
      reset()
      onClose()
    } catch (err) {
      handleApiError(err, (message) => toast.error(message.title))
    } finally {
      setLoading(false)
    }
  }

  const update = async (doc: DocumentUpdate) => {
    setLoading(true)
    try {
      await DocsService.docsUpdateDocument(doc._id, doc)
      // toast({
      //   title: "forms.edit_doc.success.title",
      //   description: "forms.edit_doc.success.description",
      // });
      toast.success(t('forms.edit_doc.success.title'), {
        description: t('forms.edit_doc.success.description'),
      })
      onClose()
    } catch (err) {
      handleApiError(err, (message) => toast.error(message.title))
    } finally {
      setLoading(false)
    }
  }

  const onSubmit: SubmitHandler<DocumentUpdate> = async (doc) => {
    try {
      if (mode === 'add') {
        add(doc as DocumentCreate)
        toast.success(t('forms.create_doc.success.title'), {
          description: t('forms.create_doc.success.description'),
        })
      } else {
        update(doc as DocumentUpdate)
        toast.success(t('forms.edit_doc.success.title'), {
          description: t('forms.edit_doc.success.description'),
        })
      }
    } catch (err) {
      handleApiError(err, (message) => toast.error(message.title))
    }
  }

  const onCancel = () => {
    if (mode === 'edit' && initialData) {
      reset()
      onClose()
    } else {
      reset()
      onClose()
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <FormProvider {...methods}>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='flex flex-col h-[90%] min-w-max'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle></DialogTitle>
            </DialogHeader>
            <div className='flex flex-col gap-2'>
              {/* 하나의 셀렉트에서 중첩 형태로 카테고리/서브카테고리 선택 */}
              <div className='flex gap-1.5'>
                <Controller
                  control={control}
                  name='category_id'
                  rules={{ required: 'Category selection is required.' }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <SelectTrigger className='text-xs w-[150px] dark:border-gray-500'>
                        <SelectValue placeholder='카테고리 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories.map((cat) => (
                            <SelectItem
                              key={cat._id}
                              value={cat._id}
                              className='px-4 text-xs'
                            >
                              {cat.name || '카테고리 없음'}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {/* {errors.category_id && (
              <FormMessage>{errors.category_id.message as string}</FormMessage>
            )} */}

                <Controller
                  control={control}
                  name='subcategory_id'
                  rules={{ required: 'Subcategory selection is required.' }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                      disabled={!selectedCategoryId}
                    >
                      <SelectTrigger className='text-xs w-[150px] dark:border-gray-500'>
                        <SelectValue placeholder='서브카테고리 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {subcategories.map((sub) => (
                            <SelectItem
                              key={sub._id}
                              value={sub._id}
                              className='px-4 text-xs'
                            >
                              {sub.name.length > 0
                                ? sub.name
                                : '서브카테고리 없음'}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.subcategory_id && (
                  <FormMessage>
                    {errors.subcategory_id.message as string}
                  </FormMessage>
                )}
              </div>

              <div className='flex gap-3'>
                <div className='grid flex-1 items-center gap-1.5 border-b dark:border-gray-500'>
                  <input
                    id='title'
                    {...register('title', {
                      required: 'Blog title is required.',
                    })}
                    placeholder={t('forms.create_doc.title_placeholder')}
                    className='border-none text-3xl bg-transparent px-2 placeholder:text-3xl h-14 focus-visible:outline-none'
                  />
                </div>
                <div className='flex items-center gap-1.5'>
                  <Label htmlFor='is_public'>
                    {t('forms.create_doc.is_public')}
                  </Label>
                  <input
                    id='is_public'
                    {...register('is_public')}
                    type='checkbox'
                    className='form-checkbox px-2 h-5 w-5 text-indigo-600'
                  />
                </div>
              </div>

              {/* 내용 필드 */}
              <div className='grid gap-2 py-2'>
                <Controller
                  control={control}
                  name='content'
                  rules={{ required: 'Content is required.' }}
                  render={({ field }) => (
                    <QuillEditor
                      initialValue={field.value as string}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.content && (
                  <FormMessage>{errors.content.message as string}</FormMessage>
                )}
              </div>

              <div className='relative bottom-10'>
                <div className='flex justify-center gap-4'>
                  <Button
                    variant='outline'
                    onClick={onCancel}
                    disabled={isSubmitting}
                    type='button'
                    className='w-20'
                  >
                    {t('forms.create_doc.cancel')}
                  </Button>
                  <MyButton
                    variant='default'
                    type='submit'
                    isLoading={isSubmitting}
                    disabled={!isDirty}
                    className='w-20'
                  >
                    {t('forms.create_doc.submit')}
                  </MyButton>
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}
