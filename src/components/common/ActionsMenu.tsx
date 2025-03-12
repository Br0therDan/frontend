'use client';
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { BsThreeDotsVertical } from 'react-icons/bs';

import type { UserPublic } from '@/client/iam';
import EditUser from '@/components/admin/users/EditUser';

import DeleteAlert from './DeleteAlert'; // (Refactored version of "Delete")

import DocsForm from '../admin/docs/document/DocsForm';
import { DocumentPublic } from '@/client/docs';

interface ActionsMenuProps {
  type: 'User' | 'Document';
  value: unknown;
  disabled?: boolean;
}

export default function ActionsMenu({
  type,
  value,
  disabled,
}: ActionsMenuProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            disabled={disabled}
            className="p-2"
            aria-label="Actions"
          >
            <BsThreeDotsVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <FiEdit />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-red-600"
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
            );
          case 'Document':
            return (
              <DocsForm
                initialData={value as DocumentPublic | undefined}
                isOpen={editOpen}
                mode="edit"
                onClose={() => setEditOpen(false)}
              />
            );

          default:
            return null;
        }
      })()}

      <DeleteAlert
        type={type}
        id={(value as { _id: string })._id || ''}
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      />
    </>
  );
}
