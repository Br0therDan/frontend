'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import { CategoryPublic } from '@/client/blog'
import EditCategory from './EditCategory'
import AddCategory from './AddCategory'
import { toast } from 'sonner'
import { CategoryService } from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'

/**
 * 카테고리 목록과 서브카테고리를 트리 형태로 보여주는 컴포넌트
 */
export default function Category() {
  const [categories, setCategories] = useState<CategoryPublic[]>([])
  const [editingCategory, setEditingCategory] = useState<CategoryPublic | null>(
    null
  )
  const [isAdding, setIsAdding] = useState(false)

  // 카테고리 목록 가져오기
  const fetchCategories = async () => {
    try {
      const response = await CategoryService.categoriesReadCategories()
      const categories = response.data
      if (!categories) {
        return
      }
      setCategories(categories)
    } catch (err) {
      handleApiError(err, (message) => toast.error(message.title))
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // 카테고리 편집 버튼 클릭 핸들러
  const handleEditClick = (category: CategoryPublic) => {
    setEditingCategory(category)
  }

  // 카테고리 추가 버튼 클릭 핸들러
  const handleAddClick = () => {
    setIsAdding(true)
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
                  <button
                    onClick={() => handleEditClick(category)}
                    className='text-sm text-blue-500 hover:underline'
                  >
                    수정
                  </button>
                  {/* 필요하다면 삭제 버튼도 추가 가능 */}
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
        <button
          onClick={handleAddClick}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        >
          카테고리 추가
        </button>
      </div>

      {/* 모달들 */}
      {isAdding && (
        <AddCategory
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
