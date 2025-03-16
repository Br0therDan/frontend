// path: src/app/[locale]/admin/layout.tsx

import React from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import AdminSidebar from '@/components/admin/admin-sidebar'
import AdminHeader from '@/components/admin/admin-header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className='flex flex-col p-2 min-h-screen w-full'>
        <AdminHeader />
        <div className='flex flex-1 bg-backgroud px-4 mx-auto w-full justify-center'>
          <div className='flex flex-col p-4 sm:p-6 w-full border rounded-lg bg-white'>
            {children}
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}
//http://local.mysingle.io:3000/auth/login