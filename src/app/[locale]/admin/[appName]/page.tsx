// path: src/app/[locale]/admin/[app]/page.tsx
import PageTitle from '@/components/common/PageTitle'
import { capitalizeFirstLetter } from '@/utils/formatName'
import React from 'react'

// 앱 대시보드 페이지 (params로 appName 전달) - SSR
export default async function AppPage({
  params,
}: {
  params: Promise<{ appName: string }>
}) {
  const { appName } = await params
  
  return (
    <div>
      <PageTitle title={`${capitalizeFirstLetter(appName)} Dashboard`} />
    </div>
  )
}
