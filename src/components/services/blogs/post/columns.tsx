import React from 'react'
import { PostPublic } from '@/client/posts'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Trash2, UserRoundPen } from 'lucide-react'
import { formatDateTime } from '@/utils/formatDate'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import DeleteAlert from '@/components/common/DeleteAlert'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

export const columns: ColumnDef<PostPublic>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className='flex justify-center'>
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex justify-center'>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title, category',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const post = row.original
      const t = useTranslations()

      return (
        <div className='truncate flex p-3 flex-col space-y-1'>
          <div className='flex items-center gap-2'>
            <Link href={`/main/posts/${post._id}`} className='text-xl'>
              {post.title}
            </Link>
            {post.is_public ? (
              <Badge className='h-4 flex p-2 justify-center'>
                {t('pages.posts.public')}
              </Badge>
            ) : (
              <Badge
                className='h-4 flex p-2 justify-center'
                variant='destructive'
              >
                {t('pages.posts.private')}
              </Badge>
            )}
          </div>
          <div className='flex gap-2'>
            {post.category?.name && (
              <span className='text-sm text-red-500'>
                {post.category.name} / {post.subcategory?.name}
              </span>
            )}
            <span className='text-sm text-gray-500'>• {post.author} •</span>
            <span className='text-sm text-gray-500'>
              {formatDateTime(post.created_at)}
            </span>
          </div>
        </div>
      )
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const post = row.original
      const [deleteOpen, setDeleteOpen] = useState(false)

      return (
        <>
          <Button variant='link'>
            <Link href={`/main/posts/${post._id}/edit`}>
              <UserRoundPen />
            </Link>
          </Button>
          <Button variant='link' onClick={() => setDeleteOpen(true)}>
            <Trash2 color='red' />
            <DeleteAlert
              type='Post'
              id={post._id}
              isOpen={deleteOpen}
              onClose={() => setDeleteOpen(false)}
            />
          </Button>
        </>
      )
    },
  },
]
