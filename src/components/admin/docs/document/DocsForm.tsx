// path: src/components/admin/docs/document/DocsForm.tsx
'use client'
import React, { useEffect, useState, useMemo } from 'react'
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
import { useSearchParams } from 'next/navigation'
import { useCollaboration } from '@/hooks/useCollaboration'


interface DocumentFormProps {
  params: {docId: string}
  initialData?: DocumentPublic
  mode: 'add' | 'edit'
}    

export default function DocumentForm({ params, initialData, mode }: DocumentFormProps) {
  const [loading, setLoading] = useState(false)
  const [aiToken, setAiToken] = useState<string | null | undefined>()
  const searchParams = useSearchParams()
  const providerState = useCollaboration({
    docId: params.docId,
    enabled: parseInt(searchParams?.get('noCollab') as string) !== 1,
  })

  const t = useTranslations()

  const methods = useForm<DocumentUpdate>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues:
      mode === 'edit'
        ? {
            ...initialData,
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

  const [categories, setCategories] = useState<DocsCategoryPublic[]>([])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await CatService.categoriesReadDocsCategory()
      return response.data
    } catch (err) {
      handleApiError(err, (message) => toast.error(message.title))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      try {
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('No AI token provided, please set TIPTAP_AI_SECRET in your environment')
        }
        const data = await response.json()

        const { token } = data

        // set state when the data received
        setAiToken(token)
      } catch (e) {
        if (e instanceof Error) {
          console.error(e.message)
        }
        setAiToken(null)
        return
      }
    }

    dataFetch()
  }, [])

  useEffect(() => {
    const loadCategories = async () => {
      const res = await fetchCategories()
      if (res) setCategories(res)
    }
    loadCategories()
  }, [])

  const selectedCategoryId = watch('category_id')
  const selectedCategory = useMemo(
    () => categories.find((cat) => cat._id === selectedCategoryId),
    [categories, selectedCategoryId]
  )
  const subcategories = selectedCategory?.subcategories || []

  const addDocument = async (doc: DocumentCreate) => {
    setLoading(true)
    try {
      await DocsService.docsCreateDocument(doc)
      toast.success(t('forms.create_doc.success.title'), {
        description: t('forms.create_doc.success.description'),
      })
      reset()
    } catch (err) {
      handleApiError(err, (message) => toast.error(message.title))
    } finally {
      setLoading(false)
    }
  }

  const updateDocument = async (doc: DocumentUpdate) => {
    setLoading(true)
    try {
      await DocsService.docsUpdateDocument(doc._id, doc)
      toast.success(t('forms.edit_doc.success.title'), {
        description: t('forms.edit_doc.success.description'),
      })
    } catch (err) {
      handleApiError(err, (message) => toast.error(message.title))
    } finally {
      setLoading(false)
    }
  }

  const onSubmit: SubmitHandler<DocumentUpdate> = async (doc) => {
    if (mode === 'add') {
      await addDocument(doc as DocumentCreate)
    } else {
      await updateDocument(doc as DocumentUpdate)
    }
  }

  const onCancel = () => {
    reset()
    // onClose()
  }

  if (loading) return <Loading />

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col space-y-4'
      >
        {/* 카테고리 / 서브카테고리 선택 */}
        <div className='flex flex-col sm:flex-row gap-4'>
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
                      <SelectItem
                        key={cat._id}
                        value={cat._id}
                        className='px-4 text-sm'
                      >
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
                disabled={!selectedCategoryId}
              >
                <SelectTrigger className='text-sm w-48'>
                  <SelectValue placeholder='서브카테고리 선택' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {subcategories.map((sub) => (
                      <SelectItem
                        key={sub._id}
                        value={sub._id}
                        className='px-4 text-sm'
                      >
                        {sub.name || '서브카테고리 없음'}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        {/* 제목 및 공개 여부 */}
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col gap-1'>
            <input
              id='title'
              {...register('title', { required: 'Blog title is required.' })}
              placeholder={t('forms.create_doc.title_placeholder')}
              className='border-b border-gray-300 text-2xl font-semibold bg-transparent p-2 focus:outline-none'
            />
            {errors.title && (
              <FormMessage>{errors.title.message as string}</FormMessage>
            )}
          </div>
          <div className='flex items-center gap-2'>
            <Label htmlFor='is_public' className='text-sm'>
              {t('forms.create_doc.is_public')}
            </Label>
            <input
              id='is_public'
              {...register('is_public')}
              type='checkbox'
              className='form-checkbox h-5 w-5 text-indigo-600'
            />
          </div>
        </div>
        {/* 에디터 영역 */}
        <div className="grid gap-2 py-2">
              <Controller
                control={control}
                name="content"
                rules={{ required: 'Content is required.' }}
                render={({ field }) => (
                  <div className="border border-gray-300 rounded">
                    <BlockEditor
                      aiToken={aiToken ?? undefined}
                      ydoc={providerState.yDoc}        // Y.Doc 인스턴스를 전달 (필요 시 생성)
                      provider={providerState.provider} // Hocuspocus Provider 인스턴스를 전달
                      onContentChange={field.onChange}
                    />
                  </div>
                )}
              />
              {errors.content && (
                <FormMessage>{errors.content.message as string}</FormMessage>
              )}
            </div>
        {/* 액션 버튼 */}
        <div className='flex justify-end gap-4 pt-4 border-t border-gray-200'>
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
            variant='default'
            type='submit'
            isLoading={isSubmitting}
            disabled={!isDirty}
            className='px-4'
          >
            {t('forms.create_doc.submit')}
          </MyButton>
        </div>
      </form>
    </FormProvider>
  )
}

