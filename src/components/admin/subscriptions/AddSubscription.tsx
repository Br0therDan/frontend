'use client'
import React from 'react'
import {
  FormProvider,
  useForm,
  Controller,
  type SubmitHandler,
} from 'react-hook-form'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { MyButton } from '@/components/common/buttons/submit-button' // Custom ShadCN-based button
import {
  SubscriptionCreate,
  SubscriptionStatus,
  SubscriptionTier,
} from '@/client/iam'

import { toast } from 'sonner'
import { AdminService } from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'
import { useState } from 'react'
import Loading from '@/components/common/Loading'

import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useApp } from '@/contexts/AppContext'
import { capitalizeFirstLetter } from '@/utils/formatName'
import LucideIcons from '@/components/common/Icons'

const TIERS: SubscriptionTier[] = ['free', 'basic', 'premium', 'enterprise']
const STATUSES: SubscriptionStatus[] = [
  'active',
  'trial',
  'canceled',
  'expired',
  'none',
]

interface SubscriptionFormProps {
  onClose: () => void
  user_id: string
}

export default function AddSubscription({
  onClose,
  user_id,
}: SubscriptionFormProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeApp, apps } = useApp()

  const methods = useForm<SubscriptionCreate>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      status: 'active',
      tier: '',
      duration_days: 0,
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = methods

  const selectedTier = TIERS.find((tier) => tier === methods.getValues('tier'))
  const selectedStatus = STATUSES.find(
    (status) => status === methods.getValues('status')
  )

  const addSubscription = async (data: SubscriptionCreate) => {
    setLoading(true)
    try {
      if (!activeApp) {
        toast.error('앱이 선택되지 않았습니다.')
        return
      }
      data.user_id = user_id
      await AdminService.adminCreateSubscription(data)
      onClose()
      toast.success('구독 생성 성공.', {
        description: '새로운 구독이 생성되었습니다.',
      })
      reset()
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }

  const onSubmit: SubmitHandler<SubscriptionCreate> = (data) => {
    addSubscription(data)
    window.location.reload()
  }

  if (loading) {
    return <Loading />
  }

  return (
    <FormProvider {...methods}>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='ghost' className='p-2' aria-label='Actions'>
            <PlusCircle />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='space-y-4'
              autoComplete='off'
            >
              <DialogHeader>
                <DialogTitle>구독 추가</DialogTitle>
                {/* <DialogDescription>{capitalizeFirstLetter(currentApp.name)} 구독을 추가합니다.</DialogDescription> */}
                <DialogDescription> 구독을 추가합니다.</DialogDescription>
              </DialogHeader>
              <div className='grid gap-2'>
                <Label htmlFor='app_id'>앱</Label>
                <Controller
                  name='app_id'
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={activeApp?._id}
                    >
                      <SelectTrigger className='text-sm w-48'>
                        <SelectValue placeholder='앱 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        {apps.map((app) => (
                          <SelectItem key={app._id} value={app._id}>
                            <LucideIcons icon={app.name} />
                            {capitalizeFirstLetter(app.name)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}  
                />
                {errors.app_id && (
                  <p className='text-red-500 text-xs'>{errors.app_id.message}</p>
                )}
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='tier'>요금제</Label>
                <Controller
                  name='tier'
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={selectedTier}
                    >
                      <SelectTrigger className='text-sm w-48'>
                        <SelectValue placeholder='요금제 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        {TIERS.map((tier) => (
                          <SelectItem key={tier} value={tier}>
                            {capitalizeFirstLetter(tier)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.tier && (
                  <p className='text-red-500 text-xs'>{errors.tier.message}</p>
                )}
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='status'>상태</Label>
                <Controller
                  name='status'
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={selectedStatus}
                    >
                      <SelectTrigger className='text-sm w-48'>
                        <SelectValue placeholder='상태 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {capitalizeFirstLetter(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && (
                  <p className='text-red-500 text-xs'>
                    {errors.status.message}
                  </p>
                )}
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='duration_days'>기간 (일)</Label>
                <Controller
                  name='duration_days'
                  control={control}
                  render={({ field }) => (
                    <Input
                      id='duration_days'
                      {...register('duration_days', {
                        required: '기간은 필수입니다.',
                      })}
                      type='number'
                      placeholder='기간을 입력하세요.'
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
                {errors.duration_days && (
                  <p className='text-red-500 text-xs'>
                    {errors.duration_days.message}
                  </p>
                )}
              </div>

              <DialogFooter>
                <MyButton
                  variant='default'
                  type='submit'
                  disabled={isSubmitting || !isDirty}
                  isLoading={isSubmitting}
                  className='w-full'
                >
                  구독 추가
                </MyButton>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}
