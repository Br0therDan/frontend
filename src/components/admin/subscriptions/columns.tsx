import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SubscriptionPublic } from '@/client/iam'
import { Checkbox } from '@/components/ui/checkbox'
// import SubscriptionForm from './SubscriptionForm'
import { AdminService } from '@/lib/api'
import { formatDate } from '@/utils/formatDate'
import EditSubscription from './EditSubscription'
import DeleteAlert from '@/components/common/DeleteAlert'
// import { capitalizeFirstLetter } from '@/utils/formatName'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import LucideIcons from '@/components/common/Icons'
import { capitalizeFirstLetter } from '@/utils/formatName'
// import LucideIcons from '@/components/common/Icons'


export const columns: ColumnDef<SubscriptionPublic>[] = [
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
    accessorKey: 'user_name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          사용자
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const subscription = row.original
      return (
        <div className='flex items-center gap-2'>
          {subscription.user.fullname}
        </div>
      )
    },
  },
  {
    accessorKey: 'user_email',
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
    cell: ({ row }) => {
      const subscription = row.original
      return <span className='text-sm'>{subscription.user.email}</span>
    },
  },
  {
    accessorKey: 'app_name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          앱
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const subscription = row.original

      return <div className='flex items-center gap-2 text-sm'><LucideIcons icon={subscription.app.name} />{capitalizeFirstLetter(subscription.app.name) }</div>
    }
  },
  {
    accessorKey: 'tier',
    header: '요금제',
    cell: ({ cell }) => {
      const tier = cell.getValue() as string
      return (
        <span className='text-sm'>
          {capitalizeFirstLetter(tier!)}
        </span>
      )
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
    cell: ({ cell }) => {
      const status = cell.getValue() as string
      return (
        <div className='flex items-center gap-2'>
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              status === 'active'
                ? 'bg-green-500'
                : status === 'trial'
                  ? 'bg-blue-500'
                  : 'bg-gray-500'
            )}
          />
          {/* {capitalizeFirstLetter(status)} */}
          {status}
        </div>
      )
    },
  },
  {
    accessorKey: 'expires_at',
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
    cell: ({ cell }) => {
      const date = new Date(cell.getValue() as string)
      return formatDate(date)
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const subscription = row.original
      return (
        <div>
          <EditSubscription 
            onClose={() => {
              window.location.reload()
              toast.success(`"${subscription.user.fullname}" 구독이 수정되었습니다.`)
            }}
            subscription={subscription} 
          />
          <DeleteAlert
            id={subscription._id}
            title='구독 삭제'
            description={`"${subscription.app.name}" 구독을 정말 삭제하시겠습니까?`}
            deleteApi={async () => {
              await AdminService.adminDeleteSubscription(subscription._id)
            }}
            onClose={() => {
              window.location.reload()
              toast.success(`"${subscription.app.name}" 구독이 삭제되었습니다.`) 
            }}
          />
        </div>
      )
    },
  },
]
