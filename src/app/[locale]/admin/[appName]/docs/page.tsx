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
export default function DocsPage({
  params,
}: {
  params: DocsPageProps['params']
}) {
  const {appName} = params
  
  return (
    <div>
      <PageTitle
        title={`${capitalizeFirstLetter(appName)} Document Management`}
      />
      <DocsTable app_name={appName} />
    </div>
  )
}
