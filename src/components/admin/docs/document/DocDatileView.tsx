
'use client'
import React, { useEffect, useState } from 'react'
import { DocsService } from '@/lib/api'
import sanitizeHtml from 'sanitize-html'
// import { useApp } from '@/contexts/AppContext'
import { DocumentPublic } from '@/client/docs'
import { handleApiError } from '@/lib/errorHandler'
import { toast } from 'sonner'
import Loading from '@/components/common/Loading'


interface DocDetaileviewProps {
  doc_id: string
  app_name: string
}

export default function DocsDetailView({doc_id, app_name}: DocDetaileviewProps) {
  const [loading, setLoading] = useState(false)
  const [doc, setDoc] = useState<DocumentPublic>()
  // const { activeApp: app } = useApp()

  useEffect(() => {
      const fetchDoc = async () => {
        setLoading(true)
        try {
          const response = await DocsService.docsReadDocumentByApp(
            doc_id || '',
            app_name
          )
          setDoc(response.data)
        } catch (err) {
          handleApiError(err, (message) => toast.error(message.title))
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
    <div className='flex min-h-screen'>
      <main className='flex-1 p-8'>
        <h1 className='text-3xl font-bold mb-4'>{doc.title}</h1>
        <section className='py-6 rounded-lg'>
          <p className='text-sm text-gray-400'>
            {doc.category?.name} / {doc.subcategory?.name}
          </p>
          <div
            className='prose my-2 mt-4 text-gray-700 p-4 min-h-60 border-t border-b'
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </section>
      </main>
    </div>
  )
}
