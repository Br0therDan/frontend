'use client';
import React from 'react';
import CustomBreadcrumb from '@/components/layout/Breadcrumb';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import '@/app/[locale]/globals.client';
import { useState } from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar onToggleExpand={setIsSidebarExpanded} />
        <main
          className={`flex-grow bg-background mx-auto p-6 w-full ml-0 transition-all duration-300 ${
            isSidebarExpanded ? 'sm:ml-52' : 'sm:ml-16'
          }`}
        >
          <CustomBreadcrumb />
          <div className="flex justify-center">
            <div className="flex flex-col p-4 w-full max-w-[1048px]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
