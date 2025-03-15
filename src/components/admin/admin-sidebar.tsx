// src/components/admin/admin-sidebar.tsx
'use client'
import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import AppSwitcher from './app-switcher'
import { AdminSearchForm } from './search-form'
import { useApp } from '@/contexts/AppContext'
import {
  Beer,
  BookText,
  Globe,
  Home,
  ShipWheel,
  SquareTerminal,
  User,
} from 'lucide-react'
import Link from 'next/link'

const items = [
  {
    title: 'Home',
    url: '/admin', // 기본값, 필요에 따라 변경
    icon: Home,
  },
  {
    title: 'Users',
    url: '/admin/users',
    icon: User,
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
        <AppSwitcher
          apps={[
            {
              name: 'Quant',
              logo: SquareTerminal,
              plan: 'Free',
              path: 'quant',
            },
            { name: 'HomeBrew', logo: Beer, plan: 'Free', path: 'homebrew' },
            { name: 'Locations', logo: Globe, plan: 'Free', path: 'locations' },
            { name: 'Yachts', logo: ShipWheel, plan: 'Free', path: 'yachts' },
          ]}
        />
        <AdminSearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                // 기본 URL 구조에서 /admin 부분은 제거하고, 선택된 app.path를 앞에 붙입니다.
                // 예: '/admin/documents' -> '/quant/documents'
                const base = '/admin'
                const subRoute = item.url.replace(base, '')
                const finalPath = `${base}/${activeApp.path}${subRoute}`
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
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
