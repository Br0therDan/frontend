// src/components/admin/app-switcher.tsx
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
import Cookies from 'js-cookie';

export default function AppSwitcher() {
  const router = useRouter()
  const { isMobile } = useSidebar()
  const { activeApp, apps, setActiveApp } = useApp()

  const handleSwitchApp = (app: typeof activeApp) => {
    setActiveApp(app)
    Cookies.set('activeApp', JSON.stringify(app));
    router.push(`/admin/${app?.name}`)
  }

  if (!activeApp) {
    return null
  }

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
                {activeApp.logo &&
                  React.createElement(activeApp.logo, { className: 'size-4' })}
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{capitalizeFirstLetter(activeApp.name)}</span>
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
                onClick={() => handleSwitchApp(app as typeof activeApp)}
                className='gap-2 p-2'
              >
                {app.logo && (
                  <div className='flex size-6 items-center justify-center rounded-sm border'>
                    {/* {React.createElement(app.logo, { className: 'size-4 shrink-0' })} */}
                    <app.logo />
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
