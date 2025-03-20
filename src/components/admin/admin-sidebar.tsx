// src/components/admin/admin-sidebar.tsx
'use client'
import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,

} from '@/components/ui/sidebar'
import AppSwitcher from './app-switcher'
import { AdminSearchForm } from './search-form'
import { useApp } from '@/contexts/AppContext'
import {
  Home,
  User,
  BookText,
  AppleIcon,
  TerminalSquare,

} from 'lucide-react'
import Link from 'next/link'


const items = [
  {
    title: 'Home',
    url: '/admin',
    icon: Home,
  },
  {
    title: 'Users',
    url: '/admin/users',
    icon: User,
  },
  {
    title: 'Apps',
    url: '/admin/apps',
    icon: AppleIcon,
  },
  {
    title: 'Documents',
    url: '/admin/docs',
    icon: BookText,
  },
]

export default function AdminSidebar() {
  const { activeApp } = useApp()
  return (
    <Sidebar>
      <SidebarHeader>
        <AppSwitcher/>
        <AdminSearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Admin</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu className='space-y-1 p-2'>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className='flex items-center space-x-1'
                >
                  <Link href='/admin'>
                    <TerminalSquare />
                    <span className='font-bold'>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {items.map((item) => {
                // 기본 URL 구조에서 /admin 부분은 제거하고, 선택된 app.path를 앞에 붙입니다.
                // 예: '/admin/documents' -> '/quant/documents'
                const base = '/admin'
                const subRoute = item.url.replace(base, '')
                const finalPath = `${base}/${activeApp?.name}${subRoute}`
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className='flex ml-2 items-center space-x-1'
                    >
                      <Link href={finalPath}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
