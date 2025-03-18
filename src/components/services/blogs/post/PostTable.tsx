'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import DataTable from '@/components/data_table/DataTable'
import { columns } from '@/components/services/postss/post/columns'
import { PostService } from '@/lib/api'
import type { PostPublic } from '@/client/posts'
import Link from 'next/link'
import { FaPlus } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { handleApiError } from '@/lib/errorHandler'
import { toast } from 'sonner'
import Loading from '@/components/common/Loading'
import { useRouter } from 'next/navigation'

export default function PostsTable() {
  const [posts, setPosts] = useState<PostPublic[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const router = useRouter()

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const response = await PostService.postsReadMyPosts()
        setPosts(response.data)
      } catch (err) {
        handleApiError(err, (message) =>
          toast.error(message.title, { description: message.description })
        )
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [toast])

  if (loading) {
    return <Loading />
  }

  return (
    <div className='space-y-0'>
      <Link href='/main/posts/add'>
        <Button
          variant='ghost'
          className='flex items-center min-w-20 gap-2'
          onClick={() => {
            router.push('/main/posts/add')
          }}
        >
          <FaPlus />
          Add Post
        </Button>
      </Link>
      <DataTable columns={columns} data={posts} />
    </div>
  )
}
