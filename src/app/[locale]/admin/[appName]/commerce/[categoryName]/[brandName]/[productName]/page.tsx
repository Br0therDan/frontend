import React from 'react'
import PageTitle from '@/components/common/PageTitle'
import { capitalizeFirstLetter } from '@/utils/formatName'


// import Footer from '@/components/layout/Footer'
// import AddSubscription from '@/components/admin/subscriptions/AddSubscription'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ 
    appName: string,
    categoryName: string 
    brandName: string
    productName: string
  }>
}) {
  const { appName, categoryName, brandName, productName } = await params
  return (
    <>
      <div className='flex flex-col h-full p-4 space-y-4 sm:p-8'>
        <PageTitle title={`${capitalizeFirstLetter(appName)} ${capitalizeFirstLetter(categoryName)} ${capitalizeFirstLetter(brandName)} ${capitalizeFirstLetter(productName)} 대시보드`} />
        
      </div>
      {/* <Footer>

      </Footer> */}
    </>
  )
}
