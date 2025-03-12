/* eslint-disable @typescript-eslint/no-unused-vars */
// path: src/app/[locale]/(home)/docs/[docId]/page.tsx
import React from 'react'
import { DocsService } from '@/lib/api'
import { notFound } from 'next/navigation'
import { SidebarTrigger } from '@/components/ui/sidebar'

interface DocsPageProps {
  params: { docTitle: string }
}

export default async function DocsPage({ params }: DocsPageProps) {
  let selectedDoc = null
  try {
    const response = await DocsService.docsReadPublicDocs()
    const docs = response.data
    selectedDoc = docs.find((doc) => doc.title === params.docTitle)
  } catch (err) {
    notFound()
  }

  return (
    <div className='flex min-h-screen'>
      <main className='flex-1 p-8'>
        <SidebarTrigger />
        <h1 className='text-3xl font-bold mb-4'>
          {selectedDoc ? selectedDoc.title : 'Introduction'}
        </h1>
        <section className='p-6 rounded-lg '>
          {selectedDoc ? (
            <>
              <p className='text-sm text-gray-400'>
                {selectedDoc.category?.name} / {selectedDoc.subcategory?.name}
              </p>
              <div
                className='prose my-2 mt-4 text-gray-700 p-4 min-h-60 border-t border-b'
                dangerouslySetInnerHTML={{ __html: selectedDoc.content || '' }}
              />
            </>
          ) : (
            <p className='text-gray-600'>Document not found.</p>
          )}
        </section>
      </main>
    </div>
  )
}
