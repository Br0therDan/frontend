'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PostPublic } from '@/client/blog' // 예시: 타입 정의
import { formatDateTime } from '@/utils/formatDate'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Loading from '@/components/common/Loading'
import { PostService } from '@/lib/api'
import { useTranslations } from 'next-intl'
import { handleApiError } from '@/lib/errorHandler'
import { toast } from 'sonner'

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()

  const postId = params.postId
  const [post, setPost] = useState<PostPublic | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations()

  // 포스트 데이터 가져오기
  useEffect(() => {
    if (!postId) return

    const fetchPost = async () => {
      try {
        setLoading(true)
        const response = await PostService.postsReadPost(
          Array.isArray(postId) ? postId[0] : postId
        )
        setPost(response.data ?? null)
      } catch (err) {
        const error = err as { response?: { data?: { detail?: string } } }
        setError(error.response?.data?.detail || t('error_fetching_post'))
        handleApiError(err, (message) => toast.error(message.title))
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  // 로딩 상태
  if (loading) {
    return <Loading />
  }

  // 에러 발생 시
  if (error) {
    return (
      <div className='p-4'>
        <p className='text-red-500'>Error: {error}</p>
        <button
          onClick={() => router.push('/main/blogs')}
          className='mt-2 text-blue-500 underline'
        >
          Go back
        </button>
      </div>
    )
  }

  // 포스트가 없을 경우
  if (!post) {
    return (
      <div className='p-4'>
        <p>Post not found.</p>
        <button
          onClick={() => router.push('/main/blogs')}
          className='mt-2 text-blue-500 underline'
        >
          Go back
        </button>
      </div>
    )
  }

  // 정상 렌더링
  return (
    <div className='flex-col mt-4 space-y-4'>
      <div>
        {post.category?.name && (
          <span className='text-sm'>
            {post.category.name} / {post.subcategory?.name}
          </span>
        )}
      </div>

      <div className='flex-col'>
        <div className='flex justify-start items-center gap-4'>
          <h1 className='text-3xl py-2'>{post.title}</h1>
          {post.is_public ? (
            <Badge>공개</Badge>
          ) : (
            <Badge variant='destructive'>비공개</Badge>
          )}
        </div>
        <div className='flex justify-between items-center gap-4'>
          <div className='text-sm text-gray-500'>
            {post.author} . {formatDateTime(post.updated_at)}
          </div>
          <div className='flex justify-end gap-4'>
            <Button
              onClick={() => router.push(`/main/blogs/${post._id}/edit`)}
              variant='outline'
            >
              편집
            </Button>
            <Button
              onClick={() => router.push('/main/blogs')}
              variant='outline'
            >
              목록으로
            </Button>
          </div>
        </div>
      </div>

      <div
        className='prose my-2 p-4 min-h-60 border-t border-b'
        dangerouslySetInnerHTML={{ __html: post.content || '' }}
      />
      <div className='flex justify-end gap-4 px-2'>
        <Button
          onClick={() => router.push(`/main/blogs/${post._id}/edit`)}
          variant='outline'
        >
          편집
        </Button>
        <Button onClick={() => router.push('/main/blogs')} variant='outline'>
          목록으로
        </Button>
      </div>
    </div>
  )
}
