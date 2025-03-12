'use client'
import React from 'react'
import { ChevronRight, type LucideIcon } from 'lucide-react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'

export interface NavMainProps {
  categories: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    subcategories?: {
      title: string
      url: string
      isActive?: boolean
      items?: {
        title: string
        url: string
        isActive?: boolean
      }[]
    }[]
  }[]
}

export function NavMain({ categories }: NavMainProps) {
  return (
    <div>
      {categories.map((category) => (
        <Collapsible
          key={category.title}
          title={category.title}
          defaultOpen
          className='group/collapsible'
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className='group/label text-sm font-bold text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            >
              <CollapsibleTrigger>
                {category.title}{' '}
                <ChevronRight className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90' />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {category.subcategories?.map((subcat) => (
                    <SidebarMenuItem key={subcat.title}>
                      <SidebarMenuButton asChild isActive={subcat.isActive}>
                        <a href={subcat.url}>{subcat.title}</a>
                      </SidebarMenuButton>
                      <SidebarMenuSub>
                        {subcat.items?.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={item.isActive}
                            >
                              <a href={item.url}>{item.title}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      ))}
    </div>
  )
}
