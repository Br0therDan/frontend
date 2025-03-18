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
// import { useCollaboration } from '@/hooks/useCollaboration'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui/input'

interface DocumentFormProps {
  mode: 'add' | 'edit'
  app_name: string
  doc_id?: string
}

export default function DocumentForm({
  mode,
  doc_id,
  app_name,
}: DocumentFormProps) {
  const [loading, setLoading] = useState(false)
  // const [aiToken, setAiToken] = useState<string | null | undefined>()
  const [editDoc, setEditDoc] = useState<DocumentPublic | null>(null)
  const [categories, setCategories] = useState<DocsCategoryPublic[]>([])

  // edit 모드에서 문서를 불러옴
  useEffect(() => {
    if (mode === 'edit') {
      const fetchDoc = async () => {
        setLoading(true)
        try {
          const response = await DocsService.docsReadDocumentByApp(
            doc_id || '',
            app_name
          )
          setEditDoc(response.data)
        } catch (err) {
          handleApiError(err, (message) => toast.error(message.title))
        } finally {
          setLoading(false)
        }
      }
      fetchDoc()
    }
  }, [mode, doc_id, app_name])

  // AI 토큰 불러오기
  // useEffect(() => {
  //   const dataFetch = async () => {
  //     try {
  //       const response = await fetch('/api/ai', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //       })
  //       if (!response.ok) {
  //         throw new Error(
  //           'No AI token provided, please set TIPTAP_AI_SECRET in your environment'
  //         )
  //       }
  //       const data = await response.json()
  //       setAiToken(data.token)
  //     } catch (e) {
  //       if (e instanceof Error) console.error(e.message)
  //       setAiToken(null)
  //     }
  //   }
  //   dataFetch()
  // }, [])

  // add 모드와 edit 모드 모두에서 카테고리 목록 불러오기
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true)
      try {
        const res = await CatService.categoriesReadDocsCategory()
        if (res) setCategories(res.data)
      } catch (err) {
        handleApiError(err, (message) => toast.error(message.title))
      } finally {
        setLoading(false)
      }
    }
    loadCategories()
  }, [])

  // useCollaboration은 항상 호출 (docId가 없으면 빈 문자열 전달)
  // const providerState = useCollaboration({
  //   docId: editDoc?._id || '',
  //   enabled: true,
  // })

  const { user: currentUser } = useAuth()
  const t = useTranslations()

  // react-hook-form 기본값: add 모드용 기본값. edit 모드인 경우 reset()으로 업데이트됨.
  const methods = useForm<DocumentUpdate>({
    mode: 'onBlur',
    criteriaMode: 'all',
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

  // edit 모드에서 문서 불러온 후 폼 초기화
  useEffect(() => {
    if (editDoc) {
      reset({
        title: editDoc.title,
        content: editDoc.content,
        is_public: editDoc.is_public,
        category_id: editDoc.category?._id,
        subcategory_id: editDoc.subcategory?._id,
      })
    }
  }, [editDoc, reset])

  const selectedCategoryId = watch('category_id')
  const selectedCategory = useMemo(
    () => categories.find((cat) => cat._id === selectedCategoryId),
    [categories, selectedCategoryId]
  )
  const subcategories = selectedCategory?.subcategories || []

  // 문서 추가 API 호출
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

  // 문서 업데이트 API 호출
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

  // 폼 제출 핸들러: edit 모드에서는 isDirty 여부에 관계없이 제출 가능하도록 처리
  const onSubmit: SubmitHandler<DocumentUpdate> = async (doc) => {
    const content = watch('content')
    const updatedDoc = { ...doc, content }
    if (mode === 'add') {
      await addDocument(updatedDoc as DocumentCreate)
    } else {
      await updateDocument(updatedDoc as DocumentUpdate)
    }
  }

  const onCancel = () => {
    reset()
  }

  if ((mode === 'edit' && !editDoc) || loading || !currentUser) {
    return <Loading />
  }

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
        <div className='flex w-full gap-2 border-b'>
          <input
            id='title'
            {...register('title', { required: 'Posts title is required.' })}
            placeholder={t('forms.create_doc.title_placeholder')}
            className='flex-1 text-2xl font-semibold bg-transparent p-2 focus:outline-none'
          />
          {errors.title && (
            <FormMessage>{errors.title.message as string}</FormMessage>
          )}

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
        <div className='grid gap-2 py-2'>
          <Controller
            control={control}
            name='content'
            rules={{ required: 'Content is required.' }}
            render={({ field }) => (
              <BlockEditor
                // aiToken={aiToken ?? undefined}
                userId={currentUser?._id}
                userName={currentUser?.fullname ?? undefined}
                // ydoc={providerState.yDoc}
                // provider={providerState.provider}
                initialContent={field.value || undefined}
                onContentChange={(content) => {
                  field.onChange(content)
                  setValue('content', content, { shouldDirty: true })
                }}
              />
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
            disabled={mode === 'add' ? !isDirty : isSubmitting}
            className='px-4'
          >
            {t('forms.create_doc.submit')}
          </MyButton>
        </div>
      </form>
    </FormProvider>
  )
}
