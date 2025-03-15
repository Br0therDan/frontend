import React from 'react'
import { DocsService } from '@/lib/api'
import { notFound } from 'next/navigation'
import DocumentForm from '@/components/admin/docs/document/DocsForm'

export default async function DocsPage({ params }: { params: Promise<{ docId: string }> }) {
  const { docId } = await params
  let doc
  try {
    const response = await DocsService.docsReadDocument(docId)
    doc = response.data
    if (!doc) {
      notFound()
    }
  } catch (err) {
    if ((err as { response?: { status?: number } }).response?.status === 404) {
      notFound()
    } else {
      throw new Error('문서를 불러오는 중 오류가 발생했습니다.')
    }
  }

  return (
    <DocumentForm mode='edit' initialData={doc} />
  )
}
