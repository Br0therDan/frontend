import { MenuItem } from '@/types/ui';
import {
  Home,
  // UsersRound,
  Settings,
  NotebookPen,
} from 'lucide-react';

export const menuItems: MenuItem[] = [
  {
    name: 'sidebar.dashboard',
    icon: Home,
    href: '/main',
    roles: ['admin', 'user'],
  },
  {
    name: 'sidebar.posts',
    icon: NotebookPen,
    href: '/main//posts',
    roles: ['admin', 'user'],
  },
  {
    name: 'sidebar.settings',
    icon: Settings,
    href: '/main//settings',
    roles: ['admin', 'user'],
  },
];
