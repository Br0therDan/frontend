'use client'
import React, { useEffect, useState } from 'react'
import { DocsService } from '@/lib/api'
import sanitizeHtml from 'sanitize-html'
import { DocumentPublic } from '@/client/docs'
import { handleApiError } from '@/lib/errorHandler'
import { toast } from 'sonner'
import Loading from '@/components/common/Loading'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface DocDetailViewProps {
  doc_id: string
  app_name: string
}

export default function DocsDetailView({
  doc_id,
  app_name,
}: DocDetailViewProps) {
  const [loading, setLoading] = useState(false)
  const [doc, setDoc] = useState<DocumentPublic | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true)
      try {
        const response = await DocsService.docsReadDocumentByApp(
          doc_id,
          app_name
        )
        setDoc(response.data)
      } catch (err) {
        handleApiError(err, (message) =>
          toast.error(message.title, { description: message.description })
        )
      } finally {
        setLoading(false)
      }
    }
    fetchDoc()
  }, [doc_id, app_name])

  const sanitizedContent = sanitizeHtml(doc?.content || '')
  if (loading) {
    return <Loading />
  }
  if (!doc) {
    return null
  }

  return (
    <div className='flex flex-col h-full'>
      {/* 메인 콘텐츠 영역: 스크롤이 필요한 경우 overflow-auto 적용 */}
      <main className='flex-1 space-y-4 pb-5 overflow-auto p-4 sm:p-8'>
        <p className='text-sm text-gray-400'>
          {doc.category?.name} / {doc.subcategory?.name}
        </p>
        <h1 className='text-2xl px-2 font-bold'>{doc.title}</h1>
        <section className='rounded-lg'>
          <div
            className='prose my-2 mt-4 text-gray-700 p-4 min-h-[240px] border-t '
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </section>
      </main>
      {/* sticky footer: fixed 대신 sticky를 사용하여 부모 컨테이너 내에서 스크롤 시에도 화면 하단에 위치 */}
      <footer className='sticky bottom-0  right-0 p-4 border-t z-50'>
        <div className='flex justify-between'>
          <Button
            variant='outline'
            onClick={() => router.push(`/admin/${app_name}/docs`)}
          >
            목록으로
          </Button>
          <Button
            variant='default'
            onClick={() =>
              router.push(`/admin/${app_name}/docs/${doc_id}/edit`)
            }
          >
            편집
          </Button>
        </div>
      </footer>
    </div>
  )
}
