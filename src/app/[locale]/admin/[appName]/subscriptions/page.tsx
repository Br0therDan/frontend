import React from 'react'
import PageTitle from '@/components/common/PageTitle'
import { capitalizeFirstLetter } from '@/utils/formatName'
import SubscriptionTable from '@/components/admin/subscriptions/SubscriptionTable'

// import Footer from '@/components/layout/Footer'
// import AddSubscription from '@/components/admin/subscriptions/AddSubscription'

export default async function SubscriptionPage({
  params,
}: {
  params: Promise<{ appName: string }>
}) {
  const { appName } = await params
  return (
    <>
      <div className='flex flex-col h-full p-4 space-y-4 sm:p-8'>
        <PageTitle title={`${capitalizeFirstLetter(appName)} 구독 관리`} />
        <SubscriptionTable app_name={appName} />
      </div>
      {/* <Footer>

      </Footer> */}
    </>
  )
}
