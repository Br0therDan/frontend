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
// import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { MyButton } from '@/components/common/buttons/submit-button' // Custom ShadCN-based button
import {
  SubscriptionPublic,
  SubscriptionStatus,
  SubscriptionTier,
  SubscriptionUpdate,
} from '@/client/iam'

import { toast } from 'sonner'
import { AdminService } from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'
import { useState } from 'react'
import Loading from '@/components/common/Loading'

import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { capitalizeFirstLetter } from '@/utils/formatName'
import { useRouter } from 'next/navigation'
import { DatePicker } from '@/components/common/buttons/DatePicker'

interface SubscriptionFormProps {
  onClose: () => void
  subscription: SubscriptionPublic
}

const TIERS: SubscriptionTier[] = ['free', 'basic', 'premium', 'enterprise']
const STATUSES: SubscriptionStatus[] = [
  'active',
  'trial',
  'canceled',
  'expired',
  'none',
]

export default function EditSubscription({
  onClose,
  subscription,
}: SubscriptionFormProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const methods = useForm<SubscriptionUpdate>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      app_id: subscription?.app_id,
      tier: subscription?.tier,
      status: subscription?.status,
      expires_at: subscription?.expires_at,
    },
  })

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = methods

  const selectedTier = TIERS.find((tier) => tier === subscription?.tier)
  const selectedStatus = STATUSES.find(
    (status) => status === subscription?.status
  )

  const editSubscription = async (data: SubscriptionUpdate) => {
    setLoading(true)
    try {
      await AdminService.adminUpdateSubscription(subscription._id, data)
      onClose()
      toast.success('구독 수정 성공.', {
        description: '구독이 수정되었습니다.',
      })
      reset()
      router.push(`/admin/${subscription.app_name}/subscriptions`)
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }

  const onSubmit: SubmitHandler<SubscriptionUpdate> = (data) => {
    editSubscription(data)
  }

  if (loading) {
    return <Loading />
  }

  return (
    <FormProvider {...methods}>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='ghost' className='p-2' aria-label='Actions'>
            <Edit />
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
                <DialogTitle>구독 수정</DialogTitle>
                <DialogDescription>
                  {subscription.user_name}의{' '}
                  {capitalizeFirstLetter(subscription.app_name)} 구독을
                  수정합니다{' '}
                </DialogDescription>
              </DialogHeader>
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
                        <SelectValue placeholder='티어 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        {TIERS.map((tier) => (
                          <SelectItem key={tier} value={tier}>
                            {tier}
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
                            {status}
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
                <Label htmlFor='expires_at'>만료일</Label>
                <Controller
                  name='expires_at'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      date={value!}
                      setDate={(date) => {
                        onChange(date)
                      }}
                    />
                  )}
                />
              </div>
              <DialogFooter>
                <MyButton
                  variant='default'
                  type='submit'
                  disabled={isSubmitting || !isDirty}
                  isLoading={isSubmitting}
                  className='w-full'
                >
                  구독 수정
                </MyButton>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}
