import React from 'react'

import { SidebarTrigger } from '@/components/ui/sidebar'
import CustomBreadcrumb from '../layout/Breadcrumb'


export default function AdminHeader() {
  return (
    <header className='flex h-14 shrink-0 items-center gap-2'>
      <SidebarTrigger />
      <CustomBreadcrumb />
    </header>
  )
}
