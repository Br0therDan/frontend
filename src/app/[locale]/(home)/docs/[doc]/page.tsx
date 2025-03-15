import React from 'react'
import { DocsService } from '@/lib/api'
import { notFound } from 'next/navigation'
import { SidebarTrigger } from '@/components/ui/sidebar'
import sanitizeHtml from 'sanitize-html'

export default async function DocsPage({ params }: { params: { docId: string } }) {
  const { docId } = params
  let doc

  try {
    const response = await DocsService.docsReadDocument(docId)
    doc = response.data
    if (!doc) {
      // 문서가 존재하지 않으면 404 처리
      notFound()
    }
  } catch (err) {
    // 에러가 404인 경우 404 처리, 그렇지 않으면 에러를 던집니다.
    if ((err as { response?: { status?: number } }).response?.status === 404) {
      notFound()
    } else {
      // 추가적인 에러 로깅 및 사용자 친화적 에러 처리를 고려할 수 있습니다.
      throw new Error('문서를 불러오는 중 오류가 발생했습니다.')
    }
  }

  // HTML 콘텐츠를 sanitize 처리
  const sanitizedContent = sanitizeHtml(doc.content || '')

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-8">
        <SidebarTrigger />
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
