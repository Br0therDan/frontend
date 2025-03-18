import React from 'react'
import ThemeToggle from '@/components/common/buttons/theme-toggle'
import LanguageSwitcher from '../common/buttons/LocaleToggle'
import { SidebarTrigger } from '@/components/ui/sidebar'
import CustomBreadcrumb from '../layout/Breadcrumb'
import Notification from '@/components/common/buttons/Notification'
import UserButton from '@/components/common/buttons/UserButton'

export default function AdminHeader() {
  return (
    <header className='bg-background bg-opacity-70 sticky top-0 px-2 sm:px-4 z-40 w-full'>
      <div className='flex items-center justify-between py-2'>
        <div className='flex items-center gap-4'>
          <SidebarTrigger />
          <CustomBreadcrumb />
        </div>
        <div className='hidden gap-2 sm:flex sm:items-center'>
          <Notification />
          <LanguageSwitcher />
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </header>
  )
}
