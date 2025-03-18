import React from 'react'
import UserTable from '@/components/admin/users/UserTable'
import PageTitle from '@/components/common/PageTitle'
import { capitalizeFirstLetter } from '@/utils/formatName'

// 사용자 목록 페이지 (params로 appName 전달하여 사용자 목록 테이블 렌더링) - SSR
export default async function UserPage({
  params,
}: {
  params: Promise<{ appName: string }>
}) {
  const { appName } = await params
  return (
    <div>
      <PageTitle title={`${capitalizeFirstLetter(appName)} User Management`} />
      <UserTable />
    </div>
  )
}
