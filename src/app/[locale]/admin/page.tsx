import React from 'react'
import { DonutChartComp } from '@/components/services/dashboard/DonutCart'
import { BarChartComp } from '@/components/services/dashboard/BarChart'
import PageTitle from '@/components/common/PageTitle'
import AppsCard from '@/components/admin/apps/AppCard'
import UserTable from '@/components/admin/users/UserTable'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import UserForm from '@/components/admin/users/UserForm'

export default async function AdminDashboard() {
  return (
    <div className='flex flex-col h-full p-4 sm:p-8'>
      <PageTitle title='Admin Dashboard' />
      <div className='flex py-4 sm:py-6 gap-3'>
        <AppsCard />
        <DonutChartComp />
        <BarChartComp />
      </div>

      <Card className='mt-4'>
        <CardHeader>
          <CardTitle>전체 사용자 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable />
        </CardContent>
        <CardFooter>
          <div className='flex items-center w-full justify-end'>
            <UserForm mode='add' />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
