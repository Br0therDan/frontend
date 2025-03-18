// path: src/app/[locale]/admin/[app]/docs/[title]/edit/page.tsx

import React from 'react'
import DocumentForm from '@/components/admin/docs/document/DocsForm'
import { DocsPageProps } from '../../page'

// 문서 수정 페이지 (params 로 appName, docId 전달) - SSR
export default function DocsEditPage({
  params,
}: {
  params: DocsPageProps['params']
}) {
  const { appName, docId } =  params

  return (
    <div>
      <DocumentForm 
        mode='edit' 
        doc_id={docId} 
        app_name={appName} 
      />
    </div>
  )
}
