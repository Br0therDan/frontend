'use client'
import React from 'react'
import PostTable from '@/components/services/postss/post/PostTable'
import PageTitle from '@/components/common/PageTitle'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Category from '@/components/services/postss/category/Category'
import { useTranslations } from 'next-intl'

const tabsConfig = [
  { title: '게시글 목록', component: PostTable },
  { title: '카테고리 관리', component: Category },
]

export default function PostsPage() {
  const finalTabs = tabsConfig
  const t = useTranslations()
  return (
    <>
      <PageTitle title={t('pages.posts.page_title')} />
      <Tabs defaultValue={finalTabs[0]?.title}>
        <TabsList className='grid w-full grid-cols-4'>
          {finalTabs.map((tab, index) => (
            <TabsTrigger key={index} value={tab.title}>
              {tab.title}
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
