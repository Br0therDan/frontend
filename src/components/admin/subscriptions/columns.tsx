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
import { capitalizeFirstLetter } from '@/utils/formatName'

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
    cell: ({ cell }) => {
      const appName = cell.getValue() as string
      return <span className='text-sm'>{capitalizeFirstLetter(appName) }</span>
    }
  },
  {
    accessorKey: 'tier',
    header: '요금제',
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
            className={`w-2 h-2 rounded-full ${
              status === 'active' ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          {status === 'active' ? 'Active' : 'Inactive'}
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
      // const { user: currentUser } = useAuth()

      return (
        <div>
          {/* <SubscriptionForm mode='edit' subscription={subscription} /> */}
          <EditSubscription subscription={subscription} />
          <DeleteAlert
            id={subscription._id}
            title='구독 삭제'
            description='정말로 구독을 삭제하시겠습니까?'
            deleteApi={async () => {
              await AdminService.adminDeleteSubscription(subscription._id)
              window.location.reload()
            }}
            onClose={() => {}}
          />
        </div>
      )
    },
  },
]
