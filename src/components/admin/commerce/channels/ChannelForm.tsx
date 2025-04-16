'use client'
import React from 'react'
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form'

import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormMessage } from '@/components/ui/form'
import { MyButton } from '@/components/common/buttons/submit-button'
import { ChannelService } from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'
import { useState } from 'react'
import Loading from '@/components/common/Loading'
import { SalesChannelCreate, SalesChannelUpdate, SalesChannel } from '@/client/commerce'
// import { useTranslations } from 'next-intl'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { Edit, PlusCircle } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { capitalizeFirstLetter } from '@/utils/formatName'

interface ChannelFormProps {
  mode: 'add' | 'edit'
  channel?: SalesChannel
  onSuccess?: () => void
}

export default function ChannelForm({ mode, channel, onSuccess }: ChannelFormProps) {
  const [loading, setLoading] = useState(false)
  // const t = useTranslations()
  const { activeApp } = useApp()

  const methods = useForm<SalesChannelUpdate | SalesChannelCreate>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues:
      mode === 'edit' && channel
        ? {
            name: channel.name,
            description: channel.description,
            channel_code: channel.channel_code
          }
        : {
            name: '',
            description: '',
            channel_code: '',
          },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = methods

  const editChannel = async (data: SalesChannelUpdate) => {
    setLoading(true)
    try {
      if (!channel) {
        throw new Error('Channel not found')
      }
      await ChannelService.channelUpdateChannel(channel._id!, data)
      toast.success('성공!', {
        description: '앱이 성공적으로 업데이트 되었습니다.',
      })
      onSuccess?.()
      reset()
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }

  const addChannel = async (channel: SalesChannelCreate) => {
    setLoading(true)
    try {
      channel.app_name = activeApp?.name ?? ''
      await ChannelService.channelCreateChannel(channel)
      toast.success('성공!', {
        description: '앱이 성공적으로 추가되었습니다.',
      })
      onSuccess?.()
      reset()
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }

  const onSubmit: SubmitHandler<SalesChannelCreate | SalesChannelUpdate> =  (data) => {
    if (mode === 'add') {
      addChannel(data as SalesChannelCreate)
    } else {
      editChannel(data as SalesChannelUpdate)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <FormProvider {...methods}>
      <Dialog>
        <DialogTrigger asChild>
        {mode === 'add' ? (
            <Button variant='default' className='w-full'>
              {' '}
              <PlusCircle />채널 추가{' '}
            </Button>
          ) : (
            <Button variant='ghost'>
              <Edit />
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className='max-w-md z-3000'>
            <DialogHeader>
              {mode === 'edit' ? (
                <>
                  <DialogTitle>채널 수정</DialogTitle>
                  <DialogDescription className='text-sm text-muted-foreground'>
                    `{capitalizeFirstLetter(channel?.name)}` 채널을 수정합니다
                  </DialogDescription>
                </>
              ) : (
                <>
                  <DialogTitle>
                  신규 채널 추가
                  </DialogTitle>
                  <DialogDescription className='text-sm text-muted-foreground'>
                  신규 채널을 추가합니다
                  </DialogDescription>
                </>
              )}
            </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='grid gap-4 py-4'>
              {/* Category Name */}
              <div className='grid gap-2'>
                <Label htmlFor='name'>채널 명</Label>
                <Input
                  id='name'
                  {...register('name', {
                    required: '채널명을 입력하세요 ',
                  })}
                  placeholder='채널명을 입력하세요'
                  type='text'
                />
                {errors.name && (
                  <FormMessage>{errors.name.message}</FormMessage>
                )}
              </div>

              {/* Description */}
              <div className='grid gap-2'>
                <Label htmlFor='description'>설명</Label>
                <Input
                  id='description'
                  {...register('description', {
                    required: '설명을 입력하세요 ',
                  })}
                  placeholder='설명을 입력하세요'
                  type='text'
                />
                {errors.description && (
                  <FormMessage>{errors.description.message}</FormMessage>
                )}
              </div>

              {/* Logo */}
              <div className='grid gap-2'>
                <Label htmlFor='logo'>채널 코드</Label>
                <Input
                  id='channel_code'
                  {...register('channel_code', {
                    required: '채널 코드를 입력하세요 ',
                  })}
                  placeholder='채널 코드를 입력하세요'
                  type='text'
                />
                {errors.channel_code && (
                  <FormMessage>{errors.channel_code.message}</FormMessage>
                )}
              </div>
            </div>

            <DialogFooter className='flex justify-end gap-3 pt-2'>
              <MyButton
                variant='default'
                type='submit'
                isLoading={isSubmitting}
                disabled={!isDirty}
                className='w-full'
              >
                저장
              </MyButton>
            </DialogFooter>
          </form>
          <DialogClose className='absolute top-4 right-4' />
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}
