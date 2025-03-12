'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Menu } from 'lucide-react';
import { menuItems } from '@/config/RoleBaseNav';
import { MyLogo, MyLogoDark } from '@/components/common/brand/logo';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
// import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useTranslations } from 'next-intl';

export function MobileSidebar() {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="block sm:hidden">
          <Menu className="h-7 w-7" />
          <span className="sr-only">Open sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        {/* <VisuallyHidden> */}
        <SheetTitle>none</SheetTitle>
        {/* </VisuallyHidden> */}
        <div className="flex items-center h-16 flex-shrink-0 px-4">
          <MyLogo className="size-10" />
          <MyLogoDark className="size-10" />
        </div>
        <ScrollArea className="flex-1">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {menuItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start',
                    pathname === item.href
                      ? 'text-blue-600 '
                      : 'hover:text-blue-600 text-accent-foreground',
                  )}
                >
                  <item.icon className="mr-3 h-6 w-6" />
                  {t(item.name)}
                </Button>
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
