'use client';
import React from 'react';
import UserAvatar from './UserAvatar';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { LogOut, User } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function UserButton() {
  const { user: userData, logout } = useAuth();
  const t = useTranslations();
  const handleLogout = () => {
    logout();
  };
  if (!userData) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" data-testid="user-menu">
          <UserAvatar userData={userData} />
          <span className="sr-only">Open sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64 p-0">
        {/* <VisuallyHidden> */}
        <SheetTitle>none</SheetTitle>
        {/* </VisuallyHidden> */}
        <div className="flex items-center px-4 mt-8 py-2 gap-3 text-sm">
          <UserAvatar userData={userData} />
          <div>
            <h1 className="text-lg font-semibold">
              {userData.fullname || 'No Name'}
            </h1>
            <h1 className="text-xs text-gray-600">{userData.email}</h1>
          </div>
        </div>

        <div className="border-t"></div>

        <ul className="space-y-1">
          <li>
            <Link
              href="/main/settings"
              className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            >
              <User className="h-5 w-5 mr-2" />
              {t('user_button.profile')}
            </Link>
          </li>
          <li
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {t('user_button.logout')}
          </li>
        </ul>
      </SheetContent>
    </Sheet>
  );
}
