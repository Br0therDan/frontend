'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { UserPublic, UserUpdateMe } from '@/client/iam'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { formatDate } from '@/utils/formatDate'
import { UsersService } from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'
import { useTranslations } from 'next-intl'
import Loading from '@/components/common/Loading'
import ProviderIcons from '@/components/common/brand/ProviderIcons'

interface FormFieldProps {
  id: keyof UserPublic
  label: string
  type: string
  register: ReturnType<typeof useForm<UserPublic>>['register']
  errors: Record<string, { message?: string }>
  placeholder?: string
  isEditMode: boolean
  defaultValue: string
}

const FormField = ({
  id,
  label,
  type,
  register,
  errors,
  placeholder,
  isEditMode,
  defaultValue,
}: FormFieldProps) => (
  <div className='flex flex-col gap-2'>
    <Label htmlFor={id} className='text-gray-400 font-light'>
      {label}
    </Label>
    {isEditMode ? (
      <Input id={id} {...register(id)} type={type} placeholder={placeholder} />
    ) : (
      <p>{defaultValue || '-'}</p>
    )}
    {errors[id] && <p className='text-red-500 text-sm'>{errors[id].message}</p>}
  </div>
)

const UserInformation = () => {
  const { user: currentUser, refreshUser } = useAuth() // refreshUser: 사용자 데이터를 다시 불러오는 함수 (컨텍스트에 구현)
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const t = useTranslations()

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty, dirtyFields },
  } = useForm<UserPublic>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {},
  })

  // currentUser가 변경될 때 폼 전체 값을 reset으로 초기화
  useEffect(() => {
    if (currentUser) {
      reset(currentUser)
    }
  }, [currentUser, reset])

  const userUpdate = useCallback(
    async (data: UserUpdateMe) => {
      try {
        setLoading(true)
        await UsersService.usersUpdateMe(data)
        toast.success(t('forms.update_user.success.title'), {
          description: t('forms.update_user.success.description'),
        })
        // 성공 시, 사용자 컨텍스트를 업데이트하거나 재요청
        if (refreshUser) {
          refreshUser()
        }
      } catch (err) {
        handleApiError(err, (message) => toast.error(message.title))
      } finally {
        setLoading(false)
        reset()
      }
    },
    [reset, t, refreshUser]
  )

  const onSubmitUserInfo: SubmitHandler<UserPublic> = useCallback(
    (data) => {
      type CommonKeys = Extract<keyof UserUpdateMe, keyof UserPublic>
      const updatedData: Partial<Record<CommonKeys, string | boolean>> = {}
      ;(Object.keys(dirtyFields) as Array<CommonKeys>).forEach((field) => {
        if (data[field] !== null && data[field] !== undefined) {
          updatedData[field] = data[field] as string | boolean
        }
      })

      if (Object.keys(updatedData).length === 0) {
        toast.warning(t('forms.notice.title'), {
          description: t('forms.notice.no_changes'),
        })
        return
      }

      userUpdate(updatedData as UserUpdateMe)
      setEditMode(false)
    },
    [dirtyFields, t, userUpdate]
  )

  const onCancel = useCallback(() => {
    reset()
    setEditMode(false)
  }, [reset])

  const toggleEditMode = () => setEditMode((prev) => !prev)

  if (loading) return <Loading />

  return (
    <div className='space-y-6'>
      <Card className='p-3 shadow-sm w-full space-y-2'>
        <CardHeader>
          <CardTitle className='text-xl'>
            {t('pages.settings.my_profile')}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmitUserInfo)}>
          <CardContent className='flex flex-col md:flex-row'>
            <div className='flex flex-col items-center space-y-4 p-2 md:pr-10'>
              <div className='border-2 w-40 h-40 flex justify-center items-center rounded-full overflow-hidden'>
                <img
                  src={currentUser?.avatar_url || '/images/default_avatar.png'}
                  alt={currentUser?.fullname || 'User Avatar'}
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='flex justify-end gap-1 mt-4'>
                <Button
                  size='sm'
                  variant='link'
                  type={editMode ? 'submit' : 'button'}
                  onClick={toggleEditMode}
                  disabled={editMode && (!isDirty || isSubmitting)}
                >
                  {editMode
                    ? isSubmitting
                      ? t('pages.settings.saving')
                      : t('pages.settings.save')
                    : t('pages.settings.edit_profile')}
                </Button>
                {editMode && (
                  <Button
                    size='sm'
                    variant='link'
                    onClick={onCancel}
                    disabled={isSubmitting}
                  >
                    {t('pages.settings.cancel')}
                  </Button>
                )}
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 min-w-64 gap-6 w-full p-2'>
              <FormField
                id='fullname'
                label={t('user.fullname')}
                type='text'
                register={register}
                errors={errors}
                placeholder='Name'
                isEditMode={editMode}
                defaultValue={currentUser?.fullname || ''}
              />
              <FormField
                id='email'
                label={t('user.email')}
                type='email'
                register={register}
                errors={errors}
                isEditMode={false}
                defaultValue={currentUser?.email || ''}
              />
              <div className='flex flex-col gap-2'>
                <Label htmlFor='provider' className='text-gray-400 font-light'>
                  {t('user.provider')}
                </Label>
                <ProviderIcons providers={currentUser?.oauth_accounts || []} />
              </div>
              <FormField
                id='mobile_phone'
                label={t('user.mobile_phone')}
                type='text'
                register={register}
                errors={errors}
                placeholder={currentUser?.mobile_phone || 'Mobile Phone'}
                isEditMode={editMode}
                defaultValue={currentUser?.mobile_phone || ''}
              />
              <FormField
                id='birthday'
                label={t('user.birthday')}
                type='date'
                register={register}
                errors={errors}
                placeholder={
                  formatDate(currentUser?.birthday) || 'Date of Birth'
                }
                isEditMode={editMode}
                defaultValue={currentUser?.birthday || ''}
              />
              <div className='flex flex-col gap-2'>
                <Label htmlFor='is_active' className='text-gray-400 font-light'>
                  {t('user.status')}
                </Label>
                <div className='flex items-center gap-2'>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      currentUser?.is_active ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  {currentUser?.is_active
                    ? t('user.active')
                    : t('user.inactive')}
                </div>
              </div>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}

export default UserInformation
