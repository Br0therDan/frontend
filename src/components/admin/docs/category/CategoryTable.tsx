'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import EditCategory from './EditCategory'
import AddCategory from './AddCategory'
import { toast } from 'sonner'
import { CatService } from '@/lib/api'
import { handleApiError } from '@/lib/errorHandler'
import { DocsCategoryPublic } from '@/client/docs'
import DeleteAlert from '@/components/common/DeleteAlert'

/**
 * 카테고리 목록과 서브카테고리를 트리 형태로 보여주는 컴포넌트
 */
interface DocsCategoryProps {
  appName: string
}

export default function DocsCategory({ appName }: DocsCategoryProps) {
  const [categories, setCategories] = useState<DocsCategoryPublic[]>([])
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

  const handleDeleteClick = async (id: string) => {
    try {
      await CatService.categoriesDeleteCategory(id)
      fetchCategories()
      toast.success('카테고리가 삭제되었습니다.')
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
                  <EditCategory
                    category={category}
                    onClose={() => {
                      fetchCategories()
                    }}
                  />
                  <DeleteAlert
                    id={category._id}
                    title='카테고리 삭제'
                    description={`"${category.name}" 카테고리를 정말 삭제하시겠습니까?`}
                    deleteApi={handleDeleteClick}
                    onClose={() => {
                      fetchCategories()
                    }}
                  />
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
      <AddCategory
        onClose={() => {
          fetchCategories()
        }}
      />
    </div>
  )
}
