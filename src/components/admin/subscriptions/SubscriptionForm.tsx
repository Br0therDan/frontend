'use client'
import React, { useEffect } from 'react'
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
import { AppPublic, SubscriptionCreate, SubscriptionPublic, SubscriptionStatus, SubscriptionTier, SubscriptionUpdate} from '@/client/iam'

import { toast } from 'sonner'
import { AdminService } from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'
import { useState } from 'react'
import Loading from '@/components/common/Loading'

import { Button } from '@/components/ui/button'
import { Edit, PlusCircle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'

interface SubscriptionFormProps {
  mode: 'add' | 'edit'
  subscription?: SubscriptionPublic
}

const TIERS: SubscriptionTier[] = ['free', 'basic', 'premium', 'enterprise'];
const STATUSES: SubscriptionStatus[] = ['active', 'trial', 'canceled', 'expired', 'none'];

export default function SubscriptionForm({ mode, subscription }: SubscriptionFormProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [apps, setApps] = useState<AppPublic[]>([])
  const router = useRouter()


  const fetchApps = async () => {
    setLoading(true)
    try {
      const response = await AdminService.adminReadApps()
      setApps(response.data)
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchApps()
  }, [])



  const methods = useForm<SubscriptionUpdate>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues:
      mode === 'edit'
        ? {
            app_id: subscription?.app_id,
            tier: subscription?.tier,
            status: subscription?.status,
            expires_at: subscription?.expires_at,
          }
        : {
            user_id: '',
            app_id: '',
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

  const selectedApp = apps.find((app) => app._id === subscription?.app_id)
  const selectedTier = TIERS.find((tier) => tier === subscription?.tier)
  const selectedStatus = STATUSES.find((status) => status === subscription?.status)

  const addSubscription = async (data: SubscriptionCreate) => {
    setLoading(true)
    try {
      await AdminService.adminCreateSubscription(data)
      toast.success("구독 생성 성공.", {
        description: '새로운 구독이 생성되었습니다.',
      })
      reset()
      router.push(`/admin/${selectedApp?.name}/subscriptions`)
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }

  const editSubscription = async (data: SubscriptionUpdate) => {
    setLoading(true)
    try {
      if (mode === 'edit' && subscription) {
        await AdminService.adminUpdateSubscription(subscription._id, data)
        toast.success("구독 수정 성공.", {
          description: '구독이 수정되었습니다.',
        })
      }
      reset()
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }

  const onSubmit: SubmitHandler<SubscriptionCreate | SubscriptionUpdate> = (data) => {
    if (mode === 'edit') {
      editSubscription(data as SubscriptionUpdate)
    } else {
      addSubscription(data as SubscriptionCreate)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <FormProvider {...methods}>
    <Dialog>
      <DialogTrigger asChild>
        {mode === 'edit' ? (
          <Button variant='ghost' className='p-2' aria-label='Actions'>
            <Edit />
          </Button>
        ) : (
          <Button className='p-2'>
            <PlusCircle />
            구독 추가
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-4'
            autoComplete='off'
          >
            <DialogHeader>
              <DialogTitle>{mode === 'edit' ? '구독 수정' : '구독 추가'}</DialogTitle>
              <DialogDescription>구독을 추가합니다.</DialogDescription>
            </DialogHeader>


            {              mode === 'edit' && (
              <div className='grid gap-2'>
                <Label htmlFor='user_id'>사용자 ID</Label>
                <Input
                  id='user_id'
                  {...register('user_id', {
                    required: '사용자 ID는 필수입니다.',
                  })}
                  type='text'
                  placeholder='사용자 ID를 입력하세요.'
                  disabled
                />
              </div>
            )}
            <div className='grid gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='user_id'>사용자 ID</Label>
                <Input
                  id='user_id'
                  {...register('user_id', {
                    required: '사용자 ID는 필수입니다.',
                  })}
                  type='text'
                  placeholder='사용자 ID를 입력하세요.'
                />
                {errors.user_id && (
                  <p className='text-red-500 text-xs'>{errors.user_id.message}</p>
                )}
              </div>


              <div className='grid gap-2'>
                <Label htmlFor='app_id'>앱</Label>
                <Controller
                  name='app_id'
                  control={control}
                  rules={{required: '앱 ID는 필수입니다.'}}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={selectedApp?._id} >
                      <SelectTrigger className='text-sm w-48'>
                        <SelectValue placeholder='앱 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        {apps.map((app) => (
                          <SelectItem key={app._id} value={app._id}>
                            {app.name || "등록된 앱이 없음."}
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
                <Label htmlFor='tier'>티어</Label>
                <Controller
                  name='tier'
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={selectedTier}>
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
                    <Select onValueChange={field.onChange} defaultValue={selectedStatus}>
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
                  <p className='text-red-500 text-xs'>{errors.status.message}</p>
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
                  <p className='text-red-500 text-xs'>{errors.duration_days.message}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <MyButton
                variant='default'
                type='submit'
                disabled={isSubmitting || !isDirty}
                isLoading={isSubmitting}
                className='w-full'
              >
                {mode === 'edit' ? '구독 수정' : '구독 추가'}
              </MyButton>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
    </FormProvider>
  )
}
