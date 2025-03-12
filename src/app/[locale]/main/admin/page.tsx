'use client';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserTable from '@/components/admin/users/UserTable';
import { useAuth } from '@/contexts/AuthContext';
import PageTitle from '@/components/common/PageTitle';
import { useTranslations } from 'next-intl';
import DocsCategory from '@/components/admin/docs/category/Category';
import DocsTable from '@/components/admin/docs/document/DocsTable';

const tabsConfig = [
  { title: 'pages.admin.users.title', component: UserTable },
  { title: 'pages.admin.docs.title', component: DocsTable },
  { title: 'pages.admin.docs_cat.title', component: DocsCategory },
];
export default function Admin() {
  const t = useTranslations();
  const { user: currentUser } = useAuth();
  const finalTabs = currentUser?.is_superuser
    ? tabsConfig.slice(0, 3)
    : tabsConfig;

  return (
    <>
      <PageTitle
        title={t('pages.admin.page_title')}
        description={t('pages.admin.page_description')}
      />
      <Tabs defaultValue={finalTabs[0]?.title}>
        <TabsList className="grid w-full grid-cols-3">
          {finalTabs.map((tab, index) => (
            <TabsTrigger key={index} value={tab.title}>
              {t(tab.title)}
            </TabsTrigger>
          ))}
        </TabsList>
        {finalTabs.map((tab, index) => (
          <TabsContent key={index} value={tab.title}>
            <tab.component />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
