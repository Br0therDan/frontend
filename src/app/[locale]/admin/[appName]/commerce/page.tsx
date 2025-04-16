import React from 'react'
import PageTitle from '@/components/common/PageTitle'
import { capitalizeFirstLetter } from '@/utils/formatName'
import CategoryCard from '@/components/admin/commerce/products/category/CategoryCard'
import ChannelsCard from '@/components/admin/commerce/channels/ChannelCard'
import BrandsCard from '@/components/admin/commerce/brands/BrandCard'

// import Footer from '@/components/layout/Footer'
// import AddSubscription from '@/components/admin/subscriptions/AddSubscription'

export default async function CommercePage({
  params,
}: {
  params: Promise<{ appName: string }>
}) {
  const { appName } = await params
  return (
    <>
      <div className='flex flex-col h-full p-4 space-y-4 sm:p-8'>
        <PageTitle
          title={`${capitalizeFirstLetter(appName)} 커머스 대시보드`}
        />
        <div className='flex py-4 sm:py-6 gap-3'>
          <CategoryCard />
          <ChannelsCard />
          <BrandsCard />
        </div>
      </div>
      {/* <Footer>

      </Footer> */}
    </>
  )
}
