// path: src/app/[locale]/admin/[app]/docs/[docId]/page.tsx

import React from 'react'
import { DocsService } from '@/lib/api'
import { notFound } from 'next/navigation'
import sanitizeHtml from 'sanitize-html'

export default async function DocsPage({ params }: { params: Promise<{ docId: string }> }) {
  const { docId } = await params
  
  console.log('DocsPage - docId:', docId)
  
  let doc
  try {
    const response = await DocsService.docsReadDocumentByApp(docId)

    doc = response.data
    if (!doc) {
      // 문서가 존재하지 않으면 404 처리
      notFound()
    }
  } catch (err) {
    console.error('DocsPage - API 호출 에러:', err)
    if ((err as { response?: { status?: number } }).response?.status === 404) {
      notFound()
    } else {
      throw new Error('문서를 불러오는 중 오류가 발생했습니다.')
    }
  }

  const sanitizedContent = sanitizeHtml(doc.content || '')

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">{doc.title}</h1>
        <section className="p-6 rounded-lg">
          <p className="text-sm text-gray-400">
            {doc.category?.name} / {doc.subcategory?.name}
          </p>
          <div
            className="prose my-2 mt-4 text-gray-700 p-4 min-h-60 border-t border-b"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </section>
      </main>
    </div>
  )
}
