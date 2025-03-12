'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import { menuItems } from '@/config/RoleBaseNav'
import { UserRound } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface SidebarProps {
  onToggleExpand: (expanded: boolean) => void
}

export default function Sidebar({ onToggleExpand }: SidebarProps) {
  const { user } = useAuth()
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(false)
  const t = useTranslations()

  // 사이드바 너비에 따른 CSS 변수 업데이트
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--sidebar-width', expanded ? '16rem' : '4rem')
    onToggleExpand(expanded)
  }, [expanded, onToggleExpand])

  return (
    <aside
      className={cn(
        'fixed top-14 bottom-0 bg-background pt-2 z-20 ',
        'transition-width duration-300 ease-in-out',
        'flex flex-col px-[5px]',
        expanded ? 'w-52' : 'w-16',
        'hidden sm:block border-r border-gray-300  dark:border-gray-700'
      )}
    >
      <nav className='flex-1 overflow-hidden'>
        <TooltipProvider>
          <ul className='space-y-3 py-4'>
            {menuItems.map((item) => (
              <li key={item.name} className='flex justify-start w-full'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center py-3 px-4 text-sm font-normal rounded-md',
                        pathname === item.href
                          ? 'text-blue-600 '
                          : 'hover:text-blue-600 text-accent-foreground'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'h-[19px] w-[19px]',
                          expanded ? 'mr-3' : 'mx-auto'
                        )}
                      />
                      {expanded && (
                        <span
                          className={cn(
                            'w-40 transition-all duration-300 ease-in-out',
                            expanded
                              ? 'flex opacity-100 max-w-full visibility-visible'
                              : 'hidden opacity-0 max-w-0 visibility-hidden'
                          )}
                        >
                          {t(item.name)}
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {!expanded && (
                    <TooltipContent side='right'>
                      <p>{t(item.name)}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </li>
              // </RoleBasedAccess>
            ))}
            <li className='flex justify-start w-full'>
              {user?.is_superuser == true && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href='/main/admin'
                      className={cn(
                        'flex items-center py-3 px-4 text-sm font-normal rounded-md',
                        pathname === '/main/admin'
                          ? 'text-blue-600 '
                          : 'hover:text-blue-600 text-accent-foreground'
                      )}
                    >
                      <UserRound
                        className={cn(
                          'h-[19px] w-[19px]',
                          expanded ? 'mr-3' : 'mx-auto'
                        )}
                      />
                      {expanded && (
                        <span
                          className={cn(
                            'w-40 transition-all duration-300 ease-in-out',
                            expanded
                              ? 'flex opacity-100 max-w-full visibility-visible'
                              : 'hidden opacity-0 max-w-0 visibility-hidden'
                          )}
                        >
                          Admin
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {!expanded && (
                    <TooltipContent side='right'>
                      <p>Admin</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              )}
            </li>
          </ul>
        </TooltipProvider>
      </nav>
      <div className='flex-col items-center'>
        <Button
          variant='ghost'
          className='flex w-full h-16 justify-center rounded-none border-t border-gray-300  dark:border-gray-700'
          size='icon'
          onClick={() => setExpanded(!expanded)}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} // 하단 고정
        >
          {expanded ? (
            <FiChevronsLeft className='h-5 w-5' />
          ) : (
            <FiChevronsRight className='h-5 w-5' />
          )}
        </Button>
      </div>
    </aside>
  )
}
