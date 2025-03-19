'use client'
import React, { useEffect, useState } from 'react'
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
import { Button } from '@/components/ui/button'
import Loading from '@/components/common/Loading'
import { handleApiError } from '@/lib/errorHandler'
import { useTranslations } from 'next-intl'
import { BlockEditor } from '@/components/BlockEditor'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

interface DocumentFormProps {
  mode: 'add' | 'edit'
  app_name: string
  doc_id?: string
}

export default function DocumentForm({ mode, doc_id, app_name }: DocumentFormProps) {
  const [loading, setLoading] = useState(false)
  const [editDoc, setEditDoc] = useState<DocumentPublic | null>(null)
  const [categories, setCategories] = useState<DocsCategoryPublic[]>([])
  const router = useRouter()
  const t = useTranslations()

  // react-hook-form 초기값 (edit 모드의 경우 나중에 reset()으로 갱신)
  const methods = useForm<DocumentUpdate | DocumentCreate>({
    defaultValues: {
      title: '',
      content: '',
      is_public: false,
      category_id: '',
      subcategory_id: '',
      media_assets: [] as string[],
    },
  })
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = methods

  // 편집 모드: 문서를 불러와서 폼 초기화 (subcategory 포함)
  useEffect(() => {
    if (mode === 'edit' && doc_id) {
      const fetchDoc = async () => {
        setLoading(true)
        try {
          const response = await DocsService.docsReadDocumentByApp(doc_id, app_name)
          setEditDoc(response.data)
          reset({
            ...response.data,
            category_id: response.data.category?._id,
            subcategory_id: response.data.subcategory?._id,
          })
        } catch (err) {
          handleApiError(err, (message) =>
            toast.error(message.title, { description: message.description })
          )
        } finally {
          setLoading(false)
        }
      }
      fetchDoc()
    }
  }, [mode, doc_id, app_name, reset])

  // 카테고리 불러오기 (add, edit 모두)
  useEffect(() => {
    const fetchCategoriesData = async () => {
      setLoading(true)
      try {
        const res = await CatService.categoriesReadDocsCategory(app_name)
        if (res) {
          setCategories(res.data)
        }
      } catch (err) {
        handleApiError(err, (message) =>
          toast.error(message.title, { description: message.description })
        )
      } finally {
        setLoading(false)
      }
    }
    fetchCategoriesData()
  }, [app_name])

  const selectedCategoryId = watch('category_id')
  const selectedCategory = categories.find((cat) => cat._id === selectedCategoryId)
  const subcategories = selectedCategory?.subcategories || []

  // 문서 추가 API 호출
  const addDocument = async (doc: DocumentCreate) => {
    setLoading(true)
    try {
      await DocsService.docsCreateDocument(doc, app_name)
      toast.success(t('forms.create_doc.success.title'), {
        description: t('forms.create_doc.success.description'),
      })
      reset()
      router.push(`/admin/${app_name}/docs`)
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }

  // 문서 업데이트 API 호출
  const updateDocument = async (doc: DocumentUpdate) => {
    setLoading(true)
    try {
      await DocsService.docsUpdateDocument(doc_id!, doc)
      toast.success(t('forms.edit_doc.success.title'), {
        description: t('forms.edit_doc.success.description'),
      })
      router.push(`/admin/${app_name}/docs/${doc_id}`)
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }

  // 폼 제출 핸들러
  const onSubmit: SubmitHandler<DocumentUpdate | DocumentCreate> = async (doc) => {
    if (mode === 'add') {
      try {
        await addDocument(doc as DocumentCreate)
      } catch (err) {
        handleApiError(err, (message) =>
          toast.error(message.title, { description: message.description })
        )
      }
    } else {
      try {
        await updateDocument(doc as DocumentUpdate)
      } catch (err) {
        handleApiError(err, (message) =>
          toast.error(message.title, { description: message.description })
        )
      }
    }
  }

  const onCancel = () => {
    if (mode === 'edit' && editDoc) {
      router.push(`/admin/${app_name}/docs/${editDoc._id}`)
    } else {
      router.push(`/admin/${app_name}/docs`)
    }
  }

  if (loading) {
    return <Loading />
  }

  // BlockEditor에 key를 추가하여, editDoc이 변경되면 강제 재마운트하여 초기 내용 반영
  const editorKey = mode === 'edit' && editDoc ? editDoc._id : 'new-editor'

  return (
    <div className='flex flex-col h-full'>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col h-full'>
          <main className='flex-1 space-y-4 pb-5 overflow-y-auto p-4 sm:p-8'>
            {/* 카테고리 / 서브카테고리 선택 */}
            <div className='flex flex-col sm:flex-row gap-4 mb-4'>
              <Controller
                control={control}
                name='category_id'
                rules={{ required: 'Category selection is required.' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <SelectTrigger className='text-sm w-48'>
                      <SelectValue placeholder='카테고리 선택' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id} className='px-4 text-sm'>
                            {cat.name || '카테고리 없음'}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <Controller
                control={control}
                name='subcategory_id'
                rules={{ required: 'Subcategory selection is required.' }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                    disabled={!selectedCategory || !selectedCategoryId}
                  >
                    <SelectTrigger className='text-sm w-48'>
                      <SelectValue placeholder='서브카테고리 선택' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {subcategories.map((sub) => (
                          <SelectItem key={sub._id} value={sub._id} className='px-4 text-sm'>
                            {sub.name.length > 0 ? sub.name : '서브카테고리 없음'}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {/* 제목 및 공개 여부 */}
            <div className='flex w-full gap-2 border-b mb-4'>
              <input
                {...register('title', { required: 'Posts title is required.' })}
                placeholder={t('forms.create_doc.title_placeholder')}
                className='flex-1 text-2xl font-semibold bg-transparent p-2 focus:outline-none'
              />
              {errors.title && <FormMessage>{errors.title.message as string}</FormMessage>}
              <div className='flex items-center gap-2'>
                <Label htmlFor='is_public' className='text-sm'>
                  {t('forms.create_doc.is_public')}
                </Label>
                <Input
                  id='is_public'
                  {...register('is_public')}
                  type='checkbox'
                  className='form-checkbox h-5 w-5 text-indigo-600'
                />
              </div>
            </div>
            {/* 에디터 영역 */}
            <div className='flex-1 flex-col max-h-[700px] min-h-[450px] bg-gray-50 dark:bg-gray-900 rounded-sm overflow-auto'>
              <div className='grid gap-2 py-2'>
                <Controller
                  control={control}
                  name='content'
                  rules={{ required: 'Content is required.' }}
                  render={({ field }) => (
                    <BlockEditor
                      key={editorKey}
                      initialContent={field.value || undefined}
                      onContentChange={(content) => {
                        if (content !== field.value) {
                          field.onChange(content)
                          setValue('content', content, { shouldDirty: true })
                        }
                      }}
                    />
                  )}
                />
                {errors.content && (
                  <FormMessage>{errors.content.message as string}</FormMessage>
                )}
              </div>
            </div>
          </main>
          {/* Footer */}
          <footer className='sticky bottom-0 right-0 p-4 border-t z-50 sm:px-8 bg-background'>
            <div className='flex justify-between'>
              <Button
                variant='outline'
                onClick={onCancel}
                disabled={isSubmitting}
                type='button'
                className='px-4'
              >
                {t('forms.create_doc.cancel')}
              </Button>
              <MyButton
                variant="outline"
                type='submit'
                isLoading={isSubmitting}
                disabled={mode === 'add' ? !isDirty : isSubmitting}
                className='px-4'
              >
                {t('forms.create_doc.submit')}
              </MyButton>
            </div>
          </footer>
        </form>
      </FormProvider>
    </div>
  )
}
