'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { BreadcrumbItems } from '@/types/ui'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb'

export default function CustomBreadcrumb() {
  const pathname = usePathname()
  const pathSegments = pathname
    .split('/')
    .filter(
      (segment) => segment && !['ko', 'ja', 'main', 'en'].includes(segment)
    )

  // 마지막 경로가 24자리 16진수(예: MongoDB ObjectId)라면 제외
  if (
    pathSegments.length > 0 &&
    /^[a-f0-9]{24}$/i.test(pathSegments[pathSegments.length - 1])
  ) {
    pathSegments.pop()
  }

  const breadcrumbItems: BreadcrumbItems[] = pathSegments.map(
    (segment, index) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: '/' + pathSegments.slice(0, index + 1).join('/'),
    })
  )

  return (
    <Breadcrumb className='hidden sm:flex'>
      <BreadcrumbList className='flex gap-1.5 items-center'>
        <BreadcrumbItem>
          <BreadcrumbLink href='/main'>Home</BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem key={index}>
            <ChevronRight className='w-4 h-4' />
            <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
