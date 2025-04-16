'use client'
import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Category } from '@/client/commerce'
import Loading from '@/components/common/Loading'
import { handleApiError } from '@/lib/errorHandler'
import { toast } from 'sonner'
import { ProductCategoryService } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { capitalizeFirstLetter } from '@/utils/formatName'
// import LucideIcons from '@/components/common/Icons'
import CategoryForm from './CategoryForm'
import { useApp } from '@/contexts/AppContext'

export default function CategoryCard() {
  const [categorys, setCategorys] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { activeApp } = useApp()

  // ✅ fetchCategorys 함수 분리
  const fetchCategorys = async () => {
    setLoading(true)
    try {
      const response = await ProductCategoryService.categoryReadCategories(activeApp ? activeApp.name : '')
      setCategorys(response.data)
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategorys()
  }, [])

  // ✅ 삭제 후 fetchCategorys 호출
  const handleDeleteClick = async (category: Category) => {
    try {
      await ProductCategoryService.categoryDeleteCategory(category._id!)
      toast.success('Category deleted successfully.', {
        description: `Category ${category.name} has been deleted.`,
      })
      await fetchCategorys() // 🔄 상태 갱신 추가
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
        <CardTitle className='flex justify-center'>제품 카테고리</CardTitle>
      </CardHeader>

      <CardContent className='flex-1 w-full '>
        <ul className='space-y-3 max-h-[300px] overflow-y-auto'>
          {categorys.map((category) => (
            <li
              key={category._id}
              className='flex items-center justify-between py-1 space-x-2 border-b'
            >
              <div className='flex-col'>
                <div className='flex items-center space-x-2'>
                  <p className="text-sm">{capitalizeFirstLetter(category.name)}</p>
                </div>
                <span className='text-xs text-gray-400'>{category.description}</span>
              </div>
              <div className='space-x-1'>
                {/* ✅ CategoryForm에서 onSuccess 추가 */}
                <CategoryForm mode='edit' category={category} onSuccess={fetchCategorys} />
                <Button
                  variant={'ghost'}
                  onClick={() => handleDeleteClick(category)}
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
        {/* ✅ CategoryForm에서 onSuccess 추가 */}
        <CategoryForm mode='add' onSuccess={fetchCategorys} />
      </CardFooter>
    </Card>
  )
}
