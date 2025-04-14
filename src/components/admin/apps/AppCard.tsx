'use client'
import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import AppForm from '@/components/admin/apps/AppForm'
import { AppPublic } from '@/client/iam'
import Loading from '@/components/common/Loading'
import { handleApiError } from '@/lib/errorHandler'
import { toast } from 'sonner'
import { AdminService, AppsService } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { capitalizeFirstLetter } from '@/utils/formatName'
import LucideIcons from '@/components/common/Icons'

export default function AppsCard() {
  const [apps, setApps] = useState<AppPublic[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // ✅ fetchApps 함수 분리
  const fetchApps = async () => {
    setLoading(true)
    try {
      const response = await AppsService.appsReadApps()
      setApps(response.data)
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApps()
  }, [])

  // ✅ 삭제 후 fetchApps 호출
  const handleDeleteClick = async (app: AppPublic) => {
    try {
      await AdminService.adminDeleteApp(app._id)
      toast.success('App deleted successfully.', {
        description: `App ${app.name} has been deleted.`,
      })
      await fetchApps() // 🔄 상태 갱신 추가
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <Card className='flex flex-col w-[350px]'>
      <CardHeader>
        <CardTitle className='flex justify-center'>Registered Apps</CardTitle>
      </CardHeader>

      <CardContent className='flex-1 w-full '>
        <ul className='space-y-3 max-h-[300px] overflow-y-auto'>
          {apps.map((app) => (
            <li
              key={app._id}
              className='flex items-center justify-between py-1 space-x-2 border-b'
            >
              <div className='flex-col'>
                <div className='flex items-center space-x-2'>
                  <LucideIcons icon={app.name} />
                  <p className="text-sm">{capitalizeFirstLetter(app.name)}</p>
                </div>
                <span className='text-xs text-gray-400'>{app.description}</span>
              </div>
              <div className='space-x-1'>
                {/* ✅ AppForm에서 onSuccess 추가 */}
                <AppForm mode='edit' app={app} onSuccess={fetchApps} />
                <Button
                  variant={'ghost'}
                  onClick={() => handleDeleteClick(app)}
                  className='text-sm text-red-500 hover:underline'
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        {/* ✅ AppForm에서 onSuccess 추가 */}
        <AppForm mode='add' onSuccess={fetchApps} />
      </CardFooter>
    </Card>
  )
}
