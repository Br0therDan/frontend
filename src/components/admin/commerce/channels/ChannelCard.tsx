'use client'
import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import ChannelForm from '@/components/admin/commerce/channels/ChannelForm'
import { SalesChannel  } from '@/client/commerce'
import Loading from '@/components/common/Loading'
import { handleApiError } from '@/lib/errorHandler'
import { toast } from 'sonner'
import { ChannelService } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { capitalizeFirstLetter } from '@/utils/formatName'
// import LucideIcons from '@/components/common/Icons'
import { useApp } from '@/contexts/AppContext'

export default function ChannelsCard() {
  const [channels, setChannels] = useState<SalesChannel[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { activeApp } = useApp()

  // ✅ fetchChannels 함수 분리
  const fetchChannels = async () => {
    setLoading(true)
    try {
      const response = await ChannelService.channelReadChannels(activeApp ? activeApp.name : '')
      setChannels(response.data)
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChannels()
  }, [])

  // ✅ 삭제 후 fetchChannels 호출
  const handleDeleteClick = async (channel: SalesChannel) => {
    try {
      await ChannelService.channelDeleteChannel(channel._id!)
      toast.success('채널 삭제.', {
        description: `${channel.name} 채널이 삭제되었습니다.`,
      })
      await fetchChannels() // 🔄 상태 갱신 추가
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
        <CardTitle className='flex justify-center'>채널 목록</CardTitle>
      </CardHeader>

      <CardContent className='flex-1 w-full '>
        <ul className='space-y-3 max-h-[300px] overflow-y-auto'>
          {channels.map((channel) => (
            <li
              key={channel._id}
              className='flex items-center justify-between py-1 space-x-2 border-b'
            >
              <div className='flex-col'>
                <div className='flex items-center space-x-2'>
                  <p className="text-sm">{capitalizeFirstLetter(channel.name)}</p>
                </div>
                <span className='text-xs text-gray-400'>{channel.description}</span>
              </div>
              <div className='space-x-1'>
                {/* ✅ ChannelForm에서 onSuccess 추가 */}
                <ChannelForm mode='edit' channel={channel} onSuccess={fetchChannels} />
                <Button
                  variant={'ghost'}
                  onClick={() => handleDeleteClick(channel)}
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
        {/* ✅ ChannelForm에서 onSuccess 추가 */}
        <ChannelForm mode='add' onSuccess={fetchChannels} />
      </CardFooter>
    </Card>
  )
}
