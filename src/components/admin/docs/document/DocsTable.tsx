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
import { Button } from '@/components/ui/button'
import { FaPlus } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'

export default function DocsTable() {
  const [docs, setDocs] = useState<DocumentPublic[]>([])
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const { activeApp } = useApp()

  const handleRoute = (activeApp: string) => {
    router.push(`/admin/${activeApp}/docs/add`)
  }

  useEffect(() => {
    const fetchDocs = async () => {
      setLoading(true)
      try {
        const response = await DocsService.docsReadDocs()
        setDocs(response.data)
      } catch (err) {
        handleApiError(err, (message) => toast.error(message.title))
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
    <div className='space-y-2'>
      <Button
        variant='ghost'
        className='flex items-center overflow-auto min-w-20 gap-2'
        onClick={() => handleRoute(activeApp.name)}
      >
        <FaPlus /> Add Document
      </Button>
      <DataTable columns={columns} data={docs} />
    </div>
  )
}
