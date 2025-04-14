'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import { columns } from './columns'
import { AdminService } from '@/lib/api'
import type { SubscriptionPublic } from '@/client/iam'
import DataTable from '@/components/data_table/DataTable'
import Loading from '@/components/common/Loading'
import { handleApiError } from '@/lib/errorHandler'
import { toast } from 'sonner'

interface SubscriptionTableProps {
  app_name: string
}

export default function SubscriptionTable( {app_name}: SubscriptionTableProps) {
  const [subscriptions, setSubscriptions] = useState<SubscriptionPublic[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true)
      try {
        const response = await AdminService.adminReadSubscriptions(
          null,
          app_name
        )
        setSubscriptions(response.data)
      } catch (err) {
        handleApiError(err, (message) =>
          toast.error(message.title, { description: message.description })
        )
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptions()
  }, [toast, AdminService])

  if (loading) {
    return <Loading />
  }

  return (
    <div className='space-y-2'>
      <DataTable columns={columns} data={subscriptions} />
    </div>
  )
}
