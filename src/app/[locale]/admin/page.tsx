import React from 'react'
import { DonutChartComp } from '@/components/services/dashboard/DonutCart'
import { BarChartComp } from '@/components/services/dashboard/BarChart'
import PageTitle from '@/components/common/PageTitle'
import AppsCard from '@/components/admin/apps/AppCard'

export default async function AdminDashboard() {
  return (
    <div className='flex flex-col h-full p-4 sm:p-8'>
      <PageTitle title='Admin Dashboard' />
      <div className='flex py-4 sm:py-6 gap-3'>
        <AppsCard />


        <DonutChartComp />
        <BarChartComp />
      </div>
    </div>
  )
}
