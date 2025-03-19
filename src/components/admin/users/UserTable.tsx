'use client'
import React from 'react'
import { useEffect, useState } from 'react'
// import AddUser from './AddUser'
// import EditUser from './EditUser'
import { columns } from './columns'
// import Navbar from '@/components/common/Navbar'
import { AdminService } from '@/lib/api'
import type { UserPublic } from '@/client/iam'
import DataTable from '@/components/data_table/DataTable'
import Loading from '@/components/common/Loading'
import { handleApiError } from '@/lib/errorHandler'
import { toast } from 'sonner'

export default function UserTable() {
  const [users, setUsers] = useState<UserPublic[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const response = await AdminService.adminReadUsers()
        setUsers(response.data)
      } catch (err) {
        handleApiError(err, (message) =>
          toast.error(message.title, { description: message.description })
        )
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [toast])

  if (loading) {
    return <Loading />
  }

  return (
    <div className='space-y-2'>
      <DataTable columns={columns} data={users} />
    </div>
  )
}
