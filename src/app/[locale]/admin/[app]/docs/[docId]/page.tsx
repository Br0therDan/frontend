'use client'
import React, { useState, useEffect } from 'react'
import { DocsService } from '@/lib/api'
import { useRouter } from 'next/navigation'
import sanitizeHtml from 'sanitize-html'
import { Button } from '@/components/ui/button'
import { useApp } from '@/contexts/AppContext'
import { DocumentPublic } from '@/client/docs'
import { handleApiError } from '@/lib/errorHandler'
import { toast } from 'sonner'
import Loading from '@/components/common/Loading'


export default function DocsPage({ params }: { params: { docId: string } }) {
  const { docId } = params
  const router = useRouter()
  const { activeApp } = useApp()

  const [doc, setDoc] = useState<DocumentPublic | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    async function fetchDoc() {
      setLoading(true)
      try {
        const response = await DocsService.docsReadDocument(docId)
        const fetchedDoc = response.data
        if (!fetchedDoc) {
          // 문서가 존재하지 않으면 404 페이지로 이동
          router.push('/404')
          return
        }
        setDoc(fetchedDoc)
      } catch (err) {
         handleApiError(err, (message) => toast.error(message.title))
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unknown error occurred')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchDoc()
  }, [docId, router])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!doc) {
    return null
  }

  const sanitizedContent = sanitizeHtml(doc.content || '')

  return (
    <>
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
      <Button variant="ghost" onClick={() => router.back()}>
        Back
      </Button>
      <Button
        variant="default"
        onClick={() =>
          router.push(`/admin/${activeApp.name}/docs/${docId}/edit`)
        }
      >
        Edit
      </Button>
    </>
  )
}
