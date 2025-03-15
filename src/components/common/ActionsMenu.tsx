// path: src/components/common/ActionsMenu.tsx

'use client'
import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { FiEdit, FiTrash } from 'react-icons/fi'
import { BsThreeDotsVertical } from 'react-icons/bs'

import type { UserPublic } from '@/client/iam'
import EditUser from '@/components/admin/users/EditUser'

import DeleteAlert from './DeleteAlert' // (Refactored version of "Delete")

import { DocumentPublic } from '@/client/docs'
import { useApp } from '@/contexts/AppContext'
import { useRouter } from 'next/navigation'

interface ActionsMenuProps {
  type: 'User' | 'Document'
  value: unknown
  disabled?: boolean
}

export default function ActionsMenu({
  type,
  value,
  disabled,
}: ActionsMenuProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { activeApp } = useApp()
  const router = useRouter()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            disabled={disabled}
            className='p-2'
            aria-label='Actions'
          >
            <BsThreeDotsVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-36'>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <FiEdit />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className='text-red-600'
          >
            <FiTrash />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {(() => {
        switch (type) {
          case 'User':
            return (
              <EditUser
                user={value as UserPublic}
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
              />
            )
          case 'Document':
            return (
              router.push(`/admin/${activeApp.name}/docs/${(value as DocumentPublic)._id}/edit`)
            )

          default:
            return null
        }
      })()}

      <DeleteAlert
        type={type}
        id={(value as { _id: string })._id || ''}
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      />
    </>
  )
}
