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

export default function AppSwitcher() {
  const router = useRouter()
  const { isMobile } = useSidebar()
  const { activeApp, apps, setActiveApp } = useApp()

  /**
   * 다른 앱을 선택했을 때
   */
  const handleSwitchApp = (app: AppPublic) => {
    setActiveApp(app)
    router.push(`/admin/${app?.name}`)
  }

  /**
   * [1] apps가 없거나 비어 있을 때
   */
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

  /**
   * [2] activeApp이 아직 결정되지 않은 상태 (기본 앱 세팅 전)
   *     - "앱이 선택되지 않음" 표시하거나, 그냥 null 처리
   */
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

  /**
   * [3] 정상적으로 activeApp이 있을 때
   */
  return (
    <SidebarMenu className='my-2'>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              {/* 왼쪽 앱 로고 */}
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                {activeApp.logo &&
                  React.createElement(activeApp.logo, { className: 'size-4' })}
              </div>
              {/* 오른쪽 텍스트 */}
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

            {/* 앱 목록 */}
            {apps.map((app, index) => (
              <DropdownMenuItem
                key={app.name}
                onClick={() => handleSwitchApp(app)}
                className='gap-2 p-2'
              >
                {/* 로고 */}
                {app.logo && (
                  <div className='flex size-6 items-center justify-center rounded-sm border'>
                    {React.createElement(app.logo, { className: 'size-4 shrink-0' })}
                  </div>
                )}
                {/* 앱 이름 */}
                {app.name}
                <DropdownMenuShortcut>
                  ⌘{index + 1}
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
