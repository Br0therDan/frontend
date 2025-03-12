import React from 'react'
import Notification from '@/components/common/buttons/Notification'
import UserButton from '@/components/common/buttons/UserButton'
import { MobileSidebar } from './mobile-sidebar'
import { MyLogo, MyLogoDark } from '@/components/common/brand/logo'
import { SearchForm } from '@/components/common/buttons/SearchBar'
import ThemeToggle from '@/components/common/buttons/theme-toggle'
import LanguageSwitcher from '../common/buttons/LocaleToggle'

export default function Header() {
  return (
    <header className='bg-background bg-opacity-70 sticky top-0 z-40 w-full border-b border-gray-300 dark:border-gray-700 '>
      <div className='flex items-center py-2'>
        <MobileSidebar />
        <div className='relative mx-3 hidden sm:block'>
          <MyLogo className='size-10' />
          <MyLogoDark className='size-10' />
        </div>
        <SearchForm />
        <div className='hidden gap-2 pr-4 lg:ml-4 sm:flex sm:items-center'>
          <Notification />
          <LanguageSwitcher />
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </header>
  )
}
