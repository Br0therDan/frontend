"use client"

import * as React from 'react'
import { ChevronsUpDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useRouter } from 'next/navigation'
import { capitalizeFirstLetter } from '@/utils/formatName'
import { useApp } from '@/contexts/AppContext'
import { AppPublic } from '@/client/iam'
import LucideIcons from '../common/Icons'


export default function AppSwitcher() {
  const router = useRouter()
  const { isMobile } = useSidebar()
  const { activeApp, apps, loading, setActiveApp } = useApp()

  const handleSwitchApp = (app: AppPublic) => {
    setActiveApp(app) // 이 시점에 쿠키 저장은 AppProvider에서 관리
    router.push(`/admin/${app.name}`)
  }

  // 1) 로딩 중이면 스피너 or 임시 텍스트
  if (loading) {
    return (
      <SidebarMenu className='my-2'>
        <SidebarMenuItem>
          <div className='p-2 text-sm text-center text-muted-foreground'>
            Loading apps...
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  // 2) 앱 목록이 로드됐지만 비어있는 경우
  if (!apps || apps.length === 0) {
    return (
      <SidebarMenu className='my-2'>
        <SidebarMenuItem>
          <div className='p-2 text-sm text-center text-muted-foreground'>
            No apps available
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  // 3) 앱 목록은 있지만 activeApp이 아직 설정되지 않은 경우
  //   (AppProvider 로직에 의해 대부분은 자동 설정될 것임)
  if (!activeApp) {
    return (
      <SidebarMenu className='my-2'>
        <SidebarMenuItem>
          <div className='p-2 text-sm text-center text-muted-foreground'>
            No active app selected
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  // 4) 정상적으로 activeApp이 있을 때 드롭다운 표시
  return (
    <SidebarMenu className='my-2'>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                {activeApp.name &&
                  <LucideIcons icon={activeApp.name} />
                }
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {capitalizeFirstLetter(activeApp.name)}
                </span>
                <span className='truncate text-xs'>
                  {activeApp.description}
                </span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>
              Apps
            </DropdownMenuLabel>
            {apps.map((app, index) => (
              <DropdownMenuItem
                key={app.name}
                onClick={() => handleSwitchApp(app)}
                className='gap-2 p-2'
              >
                {app.name && (
                  <div className='flex size-6 items-center justify-center rounded-sm border'>
                    <LucideIcons icon={app.name} />
                  </div>
                )}
                {app.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
