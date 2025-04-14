'use client'
import { useForm } from 'react-hook-form'
import * as React from 'react'
import { AdminService, DocsService, PostService } from '@/lib/api'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import { MyButton } from '@/components/common/buttons/submit-button'
import { handleApiError } from '@/lib/errorHandler'

type TypeKeys = 'User' | 'Translation' | 'Document' | 'Post'

interface DeleteProps {
  type: TypeKeys
  id: string
  isOpen: boolean
  onClose: () => void
}

const typeMessages: Record<
  TypeKeys,
  { title: string; description: string; success: string; error: string }
> = {
  User: {
    title: 'Delete User',
    description:
      'All items associated with this user will also be permanently deleted.',
    success: 'The user was deleted successfully.',
    error: 'An error occurred while deleting the user.',
  },
  Translation: {
    title: 'Delete Translation',
    description: 'This translation will be permanently deleted.',
    success: 'The translation was deleted successfully.',
    error: 'An error occurred while deleting the translation.',
  },
  Document: {
    title: 'Delete Document',
    description: 'This document will be permanently deleted.',
    success: 'The document was deleted successfully.',
    error: 'An error occurred while deleting the document.',
  },
  Post: {
    title: 'Delete Posts',
    description: 'This posts will be permanently deleted.',
    success: 'The posts was deleted successfully.',
    error: 'An error occurred while deleting the posts.',
  },
}

export default function Delete({ type, id, isOpen, onClose }: DeleteProps) {
  const cancelRef = React.useRef<HTMLButtonElement | null>(null)

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm()

  // 타입별로 삭제 처리 로직
  const deleteEntity = async (id: string) => {
    switch (type) {
      // case "Translation":
      //   await AdminService.adminDeleteTranslation(id);
      //   break;
      case 'User':
        await AdminService.adminDeleteUser(id)
        break

      case 'Post':
        await PostService.postsDeletePost(id)
        break
      case 'Document':
        await DocsService.docsDeleteDocument(id)
        break
      default:
        throw new Error(`Unexpected type: ${type}`)
    }
  }

  const deleteEntityHandler = async (id: string) => {
    try {
      await deleteEntity(id)
      toast.success(typeMessages[type].success)
      onClose()
      window.location.reload()
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    }
  }

  const onSubmit = () => {
    deleteEntityHandler(id)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <AlertDialogHeader>
            <AlertDialogTitle>{typeMessages[type]?.title}</AlertDialogTitle>
            <AlertDialogDescription className='text-sm text-muted-foreground mt-2'>
              <span>{typeMessages[type]?.description}</span>
              Are you sure? You will not be able to undo this action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='space-x-2'>
            <MyButton
              variant='destructive'
              type='submit'
              isLoading={isSubmitting}
            >
              Delete
            </MyButton>
            <MyButton
              ref={cancelRef}
              onClick={onClose}
              disabled={isSubmitting}
              variant='outline'
              type='button'
            >
              Cancel
            </MyButton>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
