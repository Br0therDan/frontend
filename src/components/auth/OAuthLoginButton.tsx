// path: src/components/auth/OAuthLoginButton.tsx

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { OAuthService } from '@/lib/api';
import { usePathname } from 'next/navigation';
import { handleApiError } from '@/lib/errorHandler';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { ButtonProps } from 'react-day-picker';

interface OAuthLoginButtonProps
  extends ButtonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  provider: 'google' | 'kakao' | 'naver';
  variant?: 'link' | 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
}

const providerConfigs = {
  google: {
    label: 'forms.login.google',
    bgColor: 'bg-[#4183F3]',
    textColor: 'text-white',
    logo: '/images/google.jpg',
    logo_height: '32',
    logo_width: '32',
  },
  kakao: {
    label: 'forms.login.kakao',
    bgColor: 'bg-[#FEE500]',
    textColor: 'text-black',
    logo: '/images/kakaologin.svg',
    logo_height: '15',
    logo_width: '15',
  },
  naver: {
    label: 'forms.login.naver',
    bgColor: 'bg-[#03C75A]',
    textColor: 'text-white',
    logo: '/images/naver_icon.png',
    logo_height: '30',
    logo_width: '30',
  },
};

export function OAuthLoginButton({
  provider,
  variant = 'link',
  ...props
}: OAuthLoginButtonProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const pathname = usePathname();

  const t = useTranslations();

  const oAuth2LoginHandler = async () => {
    setIsLoading(true);
    try {
      const redirectPath = encodeURIComponent(pathname);
      const res = await OAuthService.oAuth2OauthAuthorize(
        provider,
        null,
        redirectPath,
      );
      toast.success('로그인 중', {
        description: '잠시만 기다려주세요.',
      });
      if (res?.data) {
        // ('use server');
        window.location.href = res.data; // 외부 OAuth URL로 이동
      }
    } catch (err) {
      handleApiError(err, (message) => toast.error(message.title));
    } finally {
      setIsLoading(false);
    }
  };

  const { label, bgColor, textColor, logo, logo_height, logo_width } =
    providerConfigs[provider];

  return (
    <Button
      type="button"
      variant={variant}
      onClick={oAuth2LoginHandler}
      className={`flex justify-start p-[2px] w-full ${bgColor}`}
      disabled={isLoading} // 로딩 중 중복 클릭 방지
      {...props}
    >
      <div className="flex justify-center items-center w-9 h-9">
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <img
            src={logo}
            alt={provider}
            width={logo_width}
            height={logo_height}
            className="rounded-[5px]"
          />
        )}
      </div>
      <div className={`flex justify-center w-full pr-8 ${textColor}`}>
        <h1>{t(label)}</h1>
      </div>
    </Button>
  );
}
