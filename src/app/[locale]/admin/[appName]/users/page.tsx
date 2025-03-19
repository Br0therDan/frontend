import React from 'react'
import UserTable from '@/components/admin/users/UserTable'
import PageTitle from '@/components/common/PageTitle'
import { capitalizeFirstLetter } from '@/utils/formatName'
import UserForm from '@/components/admin/users/UserForm'
import Footer from '@/components/layout/Footer'

// 사용자 목록 페이지 (params로 appName 전달하여 사용자 목록 테이블 렌더링) - SSR
export default async function UserPage({
  params,
}: {
  params: Promise<{ appName: string }>
}) {
  const { appName } = await params
  return (
    <>
      <div className='flex flex-col h-full p-4 space-y-4 sm:p-8'>
        <PageTitle
          title={`${capitalizeFirstLetter(appName)} User Management`}
        />
        <UserTable />
      </div>
      <Footer>
        <UserForm mode='add' />
      </Footer>
    </>
  )
}
