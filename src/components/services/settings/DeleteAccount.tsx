'use client';
import React from 'react';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import DeleteConfirmation from './DeleteConfirmation';
import { useTranslations } from 'next-intl';

export default function DeleteAccount() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();
  return (
    <div className=" space-y-6">
      <Card className="p-3 shadow-sm w-full space-y-2">
        <CardHeader>
          <CardTitle className="text-xl">
            {t('forms.delete_account.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{t('forms.delete_account.description')}</p>
          <Button
            variant="destructive"
            onClick={() => setIsOpen(true)}
            className="mt-2"
          >
            {t('forms.delete_account.delete')}
          </Button>
        </CardContent>
      </Card>

      <DeleteConfirmation isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
