'use client'
import React from 'react'
import Loading from '@/components/common/Loading'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { UsersService } from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

interface DeleteConfirmationProps {
  isOpen: boolean
  onClose: () => void
}

export default function DeleteConfirmation({
  isOpen,
  onClose,
}: DeleteConfirmationProps) {
  const cancelRef = useRef<HTMLButtonElement | null>(null)

  const t = useTranslations()
  const [loading, setLoading] = useState(false)
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm()
  const { logout, user: CurrentUser } = useAuth()
  const router = useRouter()

  const onSubmit = async () => {
    setLoading(true)
    try {
      if (!CurrentUser) {
        router.push('/login')
        return
      }
      await UsersService.usersDeleteMe(CurrentUser._id)
      window.localStorage.removeItem('access_token')
      // toast({
      //   title: "Success!",
      //   description: "Your account has been deleted.",
      // });
      toast.success(t('forms.delete_account.success.title'), {
        description: t('forms.delete_account.success.description'),
      })
      logout()
      onClose()
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('forms.delete_confirmation.title')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('forms.delete_confirmation.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='space-x-2'>
          <Button
            variant='destructive'
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {t('forms.delete_confirmation.confirm')}
          </Button>
          <Button onClick={onClose} ref={cancelRef} disabled={isSubmitting}>
            {t('forms.delete_confirmation.cancel')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
