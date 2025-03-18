// path: src/app/[locale]/admin/[app]/docs/[title]/edit/page.tsx

import React from 'react'
import DocumentForm from '@/components/admin/docs/document/DocsForm'
import { DocsPageProps } from '../../page'

export default async function DocsEditPage({
  params,
}: {
  params: Promise<DocsPageProps['params']>
}) {
  const { appName, docId } = await params

  return <DocumentForm mode='edit' doc_id={docId} app_name={appName} />
}
