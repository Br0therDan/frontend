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
      {children}
    </>
  )
}
