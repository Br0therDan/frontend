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
import { useApp } from '@/contexts/AppContext'
import { AppPublic } from '@/client/docs'
import { useEffect, useState } from 'react'
import { AppsService } from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'
import { toast } from 'sonner'
import AppForm from './docs/apps/AppForm'

export interface AppType {
  name: string
  logo: React.ElementType
  description?: string
}

export default function AppSwitcher(
) {
  const router = useRouter()
  const { isMobile } = useSidebar()
  const { activeApp, setActiveApp } = useApp()
  const [apps, setApps] = useState<AppType[]>([])

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await AppsService.appsReadApps()
        const applist = response.data.map((app: AppPublic) => ({
          name: app.name,
          logo: app.logo as React.ElementType,
          description: app.description,
        }))
        setApps(applist)
      } catch (err) {
        handleApiError(err, (message) => {
          toast.error(message.title, { description: message.description })
        })
      }
    }
    fetchApps()
  }, [])

  const handleSwitchApp = (app: typeof activeApp) => {
    setActiveApp(app)
    router.push(`/admin/${app.name}`)
  }

  if (!activeApp) {
    return null
  }

  return (
    <SidebarMenu>
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
                <span className='truncate font-semibold'>{activeApp.name}</span>
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
                <div className='flex size-6 items-center justify-center rounded-sm border'>
                  <app.logo className='size-4 shrink-0' />
                </div>
                {app.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-2 p-2'>
              <AppForm mode="create" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
