import UserTable from '@/components/admin/users/UserTable'
import PageTitle from '@/components/common/PageTitle'
import { capitalizeFirstLetter } from '@/utils/formatName'
import React from 'react'

export default function UserPage({ params }: { params: { app: string } }) {
  const { app } = params
  return (
    <div> 
        <PageTitle title={`${capitalizeFirstLetter(app)} User Management`} />
        <UserTable />
    </div>
  )
}
