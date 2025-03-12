'use client'
import React from 'react'
import ChangePassword from '@/components/services/settings/ChangePassword'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import UserInformation from '@/components/services/settings/UserInformation'
import Appearance from '@/components/services/settings/Appearance'
import DeleteAccount from '@/components/services/settings/DeleteAccount'
import PageTitle from '@/components/common/PageTitle'
import { useTranslations } from 'next-intl'

const tabsConfig = [
  { title: 'pages.settings.my_profile', component: UserInformation },
  { title: 'pages.settings.change_password', component: ChangePassword },
  { title: 'pages.settings.appearance', component: Appearance },
  { title: 'pages.settings.danger_zone', component: DeleteAccount },
]

export default function UserSettings() {
  const finalTabs = tabsConfig
  const t = useTranslations()
  return (
    <>
      <PageTitle title={t('pages.settings.page_title')} />
      <Tabs defaultValue={finalTabs[0]?.title}>
        <TabsList className='grid w-full grid-cols-4'>
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
  )
}
