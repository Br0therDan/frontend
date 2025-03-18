'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
// import PostForm from '@/components/services/postss/post/PostForm'
import { PostPublic } from '@/client/posts'
import { toast } from 'sonner'
import Loading from '@/components/common/Loading'
import { PostService } from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'
import DocsForm from '@/components/admin/docs/document/DocsForm'
import { useApp } from '@/contexts/AppContext'

export default function EditPostPage() {
  const params = useParams()
  const postId = params.postId
  const [post, setPost] = useState<PostPublic | null>(null)
  const [loading, setLoading] = useState(false)
  const { activeApp } = useApp()

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
        console.error(err)
        handleApiError(err, (message) =>
          toast.error(message.title, { description: message.description })
        )
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  if (loading) {
    return <Loading />
  }

  return <DocsForm mode='edit' doc_id={post?._id} app_name={activeApp.path} />
}
