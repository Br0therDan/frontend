// path: src/components/admin/docs/document/columns.tsx
'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Edit, Trash2 } from 'lucide-react'
import { formatDateTime } from '@/utils/formatDate'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { useTranslations } from 'next-intl'
import { DocumentPublic } from '@/client/docs'
import { useApp } from '@/contexts/AppContext'
import { useRouter } from 'next/navigation'

export const columns: ColumnDef<DocumentPublic>[] = [
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
      const doc = row.original
      const t = useTranslations()
      const { activeApp } = useApp()

      return (
        <div className='truncate flex p-3 flex-col space-y-1'>
          <div className='flex items-center gap-2'>
            <Link
              href={`/admin/${activeApp.name}/docs/${doc._id}`}
              className='text-xl'
            >
              {doc.title}
            </Link>
            {doc.is_public ? (
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
            {doc.category?.name && (
              <span className='text-sm text-red-500'>
                {doc.category.name} / {doc.subcategory?.name}
              </span>
            )}
            <span className='text-sm text-gray-500'>• {doc.author} •</span>
            <span className='text-sm text-gray-500'>
              {formatDateTime(doc.created_at)}
            </span>
          </div>
        </div>
      )
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const doc = row.original
      const { activeApp } = useApp()
      const router = useRouter()

      return (
        <div>
          <Button variant='ghost' className='p-2' aria-label='Actions' onClick={() => router.push(`/admin/${activeApp.name}/docs/${doc._id}/edit`)}>
            <Edit />
          </Button>
          <Button variant='ghost' className='p-2' aria-label='Actions'>
            <Trash2 />
          </Button>
        </div>
      )
    },
  },
]
