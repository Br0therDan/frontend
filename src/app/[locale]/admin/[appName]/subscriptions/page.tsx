import React from 'react'
import PageTitle from '@/components/common/PageTitle'
import { capitalizeFirstLetter } from '@/utils/formatName'

import Footer from '@/components/layout/Footer'
import SubscriptionTable from '@/components/admin/subscriptions/SubscriptionTable'
// import SubscriptionForm from '@/components/admin/subscriptions/SubscriptionForm'
import AddSubscription from '@/components/admin/subscriptions/AddSubscription'

// 사용자 목록 페이지 (params로 appName 전달하여 사용자 목록 테이블 렌더링) - SSR
export default async function SubscriptionPage({
  params,
}: {
  params: Promise<{ appName: string }>
}) {
  const { appName } = await params
  return (
    <>
      <div className='flex flex-col h-full p-4 space-y-4 sm:p-8'>
        <PageTitle
          title={`${capitalizeFirstLetter(appName)} 구독 관리`}
        />
        <SubscriptionTable appName={appName} />
      </div>
      <Footer>
        {/* <SubscriptionForm mode='add' app_name={appName} /> */}
        <AddSubscription />
      </Footer>
    </>
  )
}
