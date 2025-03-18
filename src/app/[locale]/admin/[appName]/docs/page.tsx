// path: src/app/[locale]/admin/[appName]/docs/page.tsx

import React from 'react'
import DocsTable from '@/components/admin/docs/document/DocsTable'
import PageTitle from '@/components/common/PageTitle'
import { capitalizeFirstLetter } from '@/utils/formatName'

export interface DocsPageProps {
  params: {
    appName: string
    docId?: string
  }
}

// 문서 목록페이지 (params로 appName 전달하여 문서 목록 테이블 렌더링) - SSR
export default async function DocsPage({
  params,
}: {
  params: Promise<DocsPageProps['params']>
}) {
  const { appName } = await params

  return (
    <div className='flex flex-col h-full p-4 sm:p-8'>
      <PageTitle
        title={`${capitalizeFirstLetter(appName)} Document Management`}
      />
      <DocsTable app_name={appName} />
    </div>
  )
}
