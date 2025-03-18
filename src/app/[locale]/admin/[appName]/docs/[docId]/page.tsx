// path: src/app/[locale]/admin/[appName]/docs/[docId]/page.tsx

import React from 'react'
import { DocsPageProps } from '../page'
import DocsDetailView from '@/components/admin/docs/document/DocDatileView'

// 문서 상세보기 페이지 (params로 docId 전달하여 상세보기 렌더링) - SSR
export default async function DocsPage({
  params,
}: {
  params: Promise<DocsPageProps['params']>
}) {
  const { docId, appName } = await params

  return <DocsDetailView doc_id={docId!} app_name={appName} />
}
