import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserPublic } from '@/client/iam'
import { Checkbox } from '@/components/ui/checkbox'
import { capitalizeFirstLetter } from '@/utils/formatName'
import UserForm from './UserForm'
import { AdminService } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import DeleteAlert from '@/components/common/DeleteAlert'

export const columns: ColumnDef<UserPublic>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'fullname',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          이름
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          이메일
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
  },
  {
    accessorKey: 'oauth_accounts',
    header: 'ID제공자',
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className='flex items-center gap-2'>
          {Array.isArray(user?.oauth_accounts)
            ? user.oauth_accounts
                .map((account) => capitalizeFirstLetter(account.oauth_name))
                .join(', ')
            : 'Local'}
        </div>
      )
    },
  },
  {
    accessorKey: 'subscriptions',
    header: '구독',
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className='flex items-center gap-2'>
          {user.subscriptions?.map((subscription) => (
            <span
              key={subscription._id}
              className='text-xs font-medium text-gray-500'
            >
              <Badge
                variant='outline'
                className={`text-xs ${
                  subscription.status === 'active'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}
              >
              {capitalizeFirstLetter(subscription.app_name)} - {capitalizeFirstLetter(subscription.tier)}
              </Badge>
            </span>
          ))}
        </div>
      )
    },
  },


  {
    accessorKey: 'role',
    header: '역할',
    cell: ({ row }) => {
      const user = row.original
      return user.is_superuser ? 'Admin' : 'User'
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          상태
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const user = row.original

      return (
        <div className='flex items-center gap-2'>
          <div
            className={`w-2 h-2 rounded-full ${
              user.is_active ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          {user.is_active ? 'Active' : 'Inactive'} 
          <Badge
                variant='outline'
                className={`text-xs ${
                  user.is_verified
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}
              >{user.is_verified ? 'Verfied' : 'Not Verified'}</Badge>
        </div>

      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original
      // const { user: currentUser } = useAuth()

      return (
        <div>
          <UserForm mode='edit' user={user} />
          <DeleteAlert
            id={user._id}
            title='사용자 삭제'
            description='정말로 사용자를 삭제하시겠습니까?'
            deleteApi={async () => {
              await AdminService.adminDeleteUser(user._id)
              window.location.reload()
            }}
            onClose={() => {}}
          />
        </div>        
      )
    },
  },
]
