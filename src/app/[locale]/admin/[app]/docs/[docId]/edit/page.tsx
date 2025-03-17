// path: src/app/[locale]/admin/[app]/docs/[title]/edit/page.tsx

import React from 'react'
import DocumentForm from '@/components/admin/docs/document/DocsForm'

export default async function DocsPage({ params }: { params: Promise<{ app: string, docId: string }> }) {
  const { app, docId } = await params
  
  return (
    <DocumentForm mode='edit' doc_id={docId} app_name={app} />
  )
}
