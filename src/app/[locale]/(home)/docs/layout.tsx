'use client'
import React from 'react'
import { AppSidebar } from '@/components/home/docs/app-sidebar'
import DocsHeader from '@/components/home/docs/docs-header'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar className='mt-14' />
      <main className='flex flex-col flex-1'>
        <DocsHeader />
        {children}
      </main>
    </SidebarProvider>
  )
}
