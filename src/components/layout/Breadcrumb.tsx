'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { BreadcrumbItems } from '@/types/ui';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb';

export default function CustomBreadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname
    .split('/')
    .filter(
      (segment) => segment && !['ko', 'ja', 'main', 'en'].includes(segment),
    );

  const breadcrumbItems: BreadcrumbItems[] = pathSegments.map(
    (segment, index) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: '/' + pathSegments.slice(0, index + 1).join('/'),
    }),
  );

  return (
    <Breadcrumb className="hidden sm:flex">
      <BreadcrumbList className="flex gap-1.5 items-center">
        <BreadcrumbItem>
          <BreadcrumbLink href="/main">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem key={index}>
            <ChevronRight className="w-4 h-4" />
            <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
