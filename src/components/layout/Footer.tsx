import React from 'react'

interface FooterProps {
  children: React.ReactNode
}

export default function Footer({ children }: FooterProps) {
  return (
    <footer className='sticky bottom-0 right-0 p-4 border-t z-50 sm:px-8 bg-background'>
      <div className='flex justify-between'>{children}</div>
    </footer>
  )
}
