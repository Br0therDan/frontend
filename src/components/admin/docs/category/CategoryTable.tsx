'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import EditCategory from './EditCategory'
import AddCategory from './AddCategory'
import { toast } from 'sonner'
import { CatService } from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'
import { DocsCategoryPublic } from '@/client/docs'
import { Trash2, UserRoundPen } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * 카테고리 목록과 서브카테고리를 트리 형태로 보여주는 컴포넌트
 */
interface DocsCategoryProps {
  appName: string
}

export default function DocsCategory({appName}: DocsCategoryProps) {
  const [categories, setCategories] = useState<DocsCategoryPublic[]>([])
  const [editingCategory, setEditingCategory] =
    useState<DocsCategoryPublic | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  // 카테고리 목록 가져오기
  const fetchCategories = async () => {
    try {
      const response = await CatService.categoriesReadDocsCategory(appName)
      const categories = response.data
      if (!categories) {
        return
      }
      setCategories(categories)
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // 카테고리 편집 버튼 클릭 핸들러
  const handleEditClick = (category: DocsCategoryPublic) => {
    setEditingCategory(category)
  }

  // 카테고리 추가 버튼 클릭 핸들러
  const handleAddClick = () => {
    setIsAdding(true)
  }

  const handleDeleteClick = async (category: DocsCategoryPublic) => {
    try {
      await CatService.categoriesDeleteCategory(category._id)
      fetchCategories()
      toast.success('Category deleted successfully.', {
        description: `Category ${category.name} has been deleted.`,
      })
    } catch (err) {
      handleApiError(err, (message) =>
        toast.error(message.title, { description: message.description })
      )
    }
  }

  return (
    <div className='space-y-6 mt-4'>
      {/* 상단 네비게이션 바 */}

      {/* 전체 카테고리 트리 */}
      <div className=' shadow rounded py-4'>
        <ul className='space-y-3'>
          {categories.map((category) => (
            <li key={category._id} className='border-b pb-3 last:border-none'>
              {/* 카테고리 항목 */}
              <div className='flex items-center justify-between px-6'>
                <div className='font-bold'>{category.name}</div>
                <div className='space-x-2'>
                  <Button
                    variant={'ghost'}
                    onClick={() => handleEditClick(category)}
                    className='text-sm text-blue-500 hover:underline'
                  >
                    <UserRoundPen className='w-4 h-4' />
                  </Button>
                  <Button
                    variant={'ghost'}
                    onClick={() => handleDeleteClick(category)}
                    className='text-sm text-red-500 hover:underline'
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </div>
              </div>
              {/* 서브카테고리 목록 */}
              {category.subcategories && (
                <ul className='mx-4 mt-2 px-4 py-2 space-y-1 border rounded'>
                  {category.subcategories.map((subcat) => (
                    <li
                      key={subcat._id}
                      className='flex items-center justify-between text-sm'
                    >
                      <span>{subcat.name}</span>
                      {/* 서브카테고리 수정/삭제 로직 추가 가능 */}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* 카테고리 추가 버튼 */}
      <div className='flex justify-end'>
        <Button
          variant='outline'
          onClick={handleAddClick}
        >
          Add Category
        </Button>
      </div>

      {/* 모달들 */}
      {isAdding && (
        <AddCategory
          appName={appName} 
          isOpen={isAdding}
          onClose={() => {
            setIsAdding(false)
            fetchCategories() // 새로 추가 후 목록 갱신
          }}
        />
      )}
      {editingCategory && (
        <EditCategory
          isOpen={!!editingCategory}
          onClose={() => {
            setEditingCategory(null)
            fetchCategories() // 수정 후 목록 갱신
          }}
          category={editingCategory}
        />
      )}
    </div>
  )
}
