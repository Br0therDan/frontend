'use client';
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';

export default function Appearance() {
  const { theme, setTheme } = useTheme(); // 현재 테마 확인 및 테마 설정 함수
  const t = useTranslations();
  return (
    <div className=" space-y-6">
      <Card className="p-3 shadow-sm w-full space-y-2">
        <CardHeader>
          <CardTitle className="text-xl">
            {t('forms.appearance.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex">
          {/* RadioGroup에서 선택된 테마 값 관리 */}
          <RadioGroup
            value={theme} // 현재 테마 상태
            onValueChange={(value) => setTheme(value)} // 선택 값 변경 시 테마 업데이트
            className="flex flex-col space-y-6"
          >
            {/* 라이트 모드 */}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light" className="flex items-center space-x-2">
                <span>{t('forms.appearance.light_mode')}</span>
                <Badge variant="outline" className="ml-1">
                  Default
                </Badge>
              </Label>
            </div>

            {/* 다크 모드 */}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">{t('forms.appearance.dark_mode')}</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}
