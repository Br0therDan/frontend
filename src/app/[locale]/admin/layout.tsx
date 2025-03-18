// path: src/app/[locale]/admin/layout.tsx

import React from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import AdminSidebar from '@/components/admin/admin-sidebar'
import AdminHeader from '@/components/admin/admin-header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className='flex flex-col min-h-screen w-full'>
        <AdminHeader />
        <div className='flex flex-1 flex-col mx-auto w-full justify-center'>
            {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
