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
  CategoryPublic,
  PostCreate,
  PostPublic,
  PostUpdate,
} from '@/client/blog'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
// import { FormMessage } from '@/components/ui/form';
import { MyButton } from '@/components/common/buttons/submit-button'
import { CategoryService, PostService } from '@/lib/api'
import QuillEditor from '@/components/common/editor/QuillEditor'
import 'react-quill/dist/quill.snow.css'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import Loading from '@/components/common/Loading'
import { handleApiError } from '@/lib/errorHandler'
import { useTranslations } from 'next-intl'

interface PostFormProps {
  mode: 'add' | 'edit'
  initialData?: PostPublic
}

export default function PostForm({ mode, initialData }: PostFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const t = useTranslations()

  const methods = useForm<PostUpdate>({
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
    formState: { isSubmitting, isDirty },
  } = methods

  // 카테고리 목록 상태 (CategoryPublic에는 id, name, subcat 필드가 있음)
  const [categories, setCategories] = useState<CategoryPublic[]>([])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await CategoryService.categoriesReadCategories()
      const categories = response.data
      // toast({
      //   title: "Success!",
      //   description: "Categories fetched successfully.",
      // });
      toast.success('Success!', {
        description: 'Categories fetched successfully.',
      })
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

  const onSubmit: SubmitHandler<PostUpdate> = async (data) => {
    try {
      if (mode === 'add') {
        add(data as PostCreate)
        router.push('/main/posts')
      } else {
        update(data as PostUpdate)
        router.push(`/main/posts/${data.id}`)
      }
    } catch (err) {
      handleApiError(err, (message) => toast.error(message.title))
    } finally {
      setLoading(false)
    }
  }

  const add = async (post: PostCreate) => {
    try {
      await PostService.postsCreatePost(post)
      toast.success('forms.create_post.success.title', {
        description: 'forms.create_post.success.description',
      })
      reset()
    } catch (err) {
      handleApiError(err, (message) => toast.error(message.title))
    }
  }

  const update = async (post: PostUpdate) => {
    try {
      await PostService.postsUpdatePost(post.id, post)
      // toast({
      //   title: "forms.edit_post.success.title",
      //   description: "forms.edit_post.success.description",
      // });
      toast.success(t('forms.edit_post.success.title'), {
        description: t('forms.edit_post.success.description'),
      })
      reset()
    } catch (err) {
      handleApiError(err, (message) => toast.error(message.title))
    }
  }

  const onCancel = () => {
    if (mode === 'edit' && initialData) {
      router.push(`/main/posts/${initialData?._id}`)
    } else {
      router.push('/main/posts')
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                          {sub.name.length > 0 ? sub.name : '서브카테고리 없음'}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {/* {errors.subcategory_id && (
              <FormMessage>
                {errors.subcategory_id.message as string}
              </FormMessage>
            )} */}
          </div>

          <div className='flex gap-3'>
            <div className='grid flex-1 items-center gap-1.5 border-b dark:border-gray-500'>
              <input
                id='title'
                {...register('title', {
                  required: 'Blog title is required.',
                })}
                placeholder={t('forms.create_post.title_placeholder')}
                className='border-none text-3xl bg-transparent px-2 placeholder:text-3xl h-14 focus-visible:outline-none'
              />
            </div>
            <div className='flex items-center gap-1.5'>
              <Label htmlFor='is_public'>
                {t('forms.create_post.is_public')}
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
            {/* {errors.content && (
              <FormMessage>{errors.content.message as string}</FormMessage>
            )} */}
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
                {t('forms.create_post.cancel')}
              </Button>
              <MyButton
                variant='default'
                type='submit'
                isLoading={isSubmitting}
                disabled={!isDirty}
                className='w-20'
              >
                {t('forms.create_post.submit')}
              </MyButton>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
