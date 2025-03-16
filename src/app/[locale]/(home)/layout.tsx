import React from 'react'
import HomeHeader from '@/components/home/Header'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <HomeHeader />
      <main className='flex flex-col p-2 min-h-screen w-full'>
        <div className='flex flex-1 bg-backgroud px-4 mx-auto w-full justify-center'>
          <div className='flex flex-col p-4 sm:p-6 w-full bg-white'>
            {children}
          </div>
        </div>
      </main>
    </>
  )
}
