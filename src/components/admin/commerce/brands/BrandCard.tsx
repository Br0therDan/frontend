'use client'
import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import BrandForm from '@/components/admin/commerce/brands/BrandForm'
import { Brand } from '@/client/commerce'
import Loading from '@/components/common/Loading'
import { handleApiError } from '@/lib/errorHandler'
import { toast } from 'sonner'
import { BrandService } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { capitalizeFirstLetter } from '@/utils/formatName'
import { useApp } from '@/contexts/AppContext'


export default function BrandsCard() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { activeApp } = useApp()
  

  // ✅ fetchApps 함수 분리
  const fetchBrands = async () => {
    setLoading(true)
    try {
      const response = await BrandService.brandReadBrands(activeApp ? activeApp.name : '')
      setBrands(response.data)
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [])

  // ✅ 삭제 후 fetchApps 호출
  const handleDeleteClick = async (brand: Brand) => {
    try {
      await BrandService.brandDeleteBrand(brand._id!)
      toast.success('App deleted successfully.', {
        description: `"${brand.name}"가 삭제되었습니다.`,
      })
      await fetchBrands() // 🔄 상태 갱신 추가
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
        <CardTitle className='flex justify-center'>브랜드 목록</CardTitle>
      </CardHeader>

      <CardContent className='flex-1 w-full '>
        <ul className='space-y-3 max-h-[300px] overflow-y-auto'>
          {brands.map((brand) => (
            <li
              key={brand._id}
              className='flex items-center justify-between py-1 space-x-2 border-b'
            >
              <div className='flex-col'>
                <div className='flex items-center space-x-2'>
                  <p className="text-sm">{capitalizeFirstLetter(brand.name)}</p>
                </div>
                <span className='text-xs text-gray-400'>{brand.description}</span>
              </div>
              <div className='space-x-1'>
                {/* ✅ AppForm에서 onSuccess 추가 */}
                <BrandForm mode='edit' brand={brand} onSuccess={fetchBrands} />
                <Button
                  variant={'ghost'}
                  onClick={() => handleDeleteClick(brand)}
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
        <BrandForm mode='add' onSuccess={fetchBrands} />
      </CardFooter>
    </Card>
  )
}
