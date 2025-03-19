// path: src/components/admin/docs/document/DocsTable.tsx

'use client'
import { useEffect, useState } from 'react'
import DataTable from '@/components/data_table/DataTable'
import { DocsService } from '@/lib/api'
import React from 'react'
import { handleApiError } from '@/lib/errorHandler'
import { toast } from 'sonner'
import Loading from '@/components/common/Loading'
import { DocumentPublic } from '@/client/docs'
import { columns } from './columns'

interface DocsTableProps {
  app_name: string
}

export default function DocsTable({ app_name }: DocsTableProps) {
  const [docs, setDocs] = useState<DocumentPublic[]>([])
  // const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  // const { activeApp } = useApp()

  // const handleRoute = (activeApp: string) => {
  //   router.push(`/admin/${activeApp}/docs/add`)
  // }

  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true)
      try {
        const response = await DocsService.docsReadDocsByApp(app_name)
        setDocs(response.data)
      } catch (err) {
        handleApiError(err, (message) =>
          toast.error(message.title, { description: message.description })
        )
      } finally {
        setLoading(false)
      }
    }
    fetchDocs()
  }, [toast])

  if (loading) {
    return <Loading />
  }

  return (
    <div className='flex flex-col h-full'>
      <main className='flex-1 space-y-4 pb-5 overflow-y-auto p-4 sm:p-8'>

      <DataTable columns={columns} data={docs} />
      </main>
    </div>
  )
}
