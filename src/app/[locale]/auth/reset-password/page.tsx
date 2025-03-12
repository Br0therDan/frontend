'use client';
import React from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { confirmPasswordRules, passwordRules } from '@/utils/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { NewPassword } from '@/client/iam';
import { handleApiError } from '@/lib/errorHandler';
import { useTranslations } from 'next-intl';
import { MyLogo, MyLogoDark } from '@/components/common/brand/logo';

interface NewPasswordForm extends NewPassword {
  confirm_password: string;
}

export default function ResetPassword() {
  const router = useRouter();
  const t = useTranslations('auth');
  const e = useTranslations();
  const { resetPassword, resetError } = useAuth();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordForm>({
    mode: 'onBlur',
    criteriaMode: 'all',
  });

  const onSubmit: SubmitHandler<NewPasswordForm> = async (data) => {
    if (isSubmitting) return;
    if (resetError) {
      resetError();
    }
    try {
      await resetPassword(data);
      toast.success(t('reset_password.success.title'), {
        description: t('reset_password.success.description'),
      });
      router.push('/auth/login');
    } catch (err) {
      handleApiError(err, (message) => toast.error(message.title));
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card className="w-full max-w-md p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              <div className="relative">
                <MyLogo className="size-10" />
                <MyLogoDark className="size-10" />
              </div>
              {t('forms.forgot_password.title')}
            </CardTitle>
            <CardDescription>
              {t('forms.reset_password.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <Input
                  id="password"
                  {...register('new_password', passwordRules())}
                  placeholder={t('forms.reset_password.new_password')}
                  type="password"
                />
                {errors && (
                  <p className="text-sm text-red-500">
                    {e(errors.new_password?.message)}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <Input
                  id="confirm_password"
                  {...register(
                    'confirm_password',
                    confirmPasswordRules(getValues),
                  )}
                  placeholder={t('user.confirm_password')}
                  type="password"
                />
                {errors && (
                  <p className="text-sm text-red-500">
                    {e(errors.confirm_password?.message)}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                {t('forms.reset_password.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
