import React from 'react'

interface PageTitleProps {
  title: string
  description?: string
}

export default function PageTitle({ title, description }: PageTitleProps) {
  return (
    <div className='flex flex-col py-4'>
      <h1 className='text-3xl font-semibold'>{title}</h1>
      <p className='text-sm '>{description}</p>
    </div>
  )
}
