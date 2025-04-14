// path: src/app/[locale]/admin/[appName]/docs/page.tsx

import React from 'react'
import DocsTable from '@/components/admin/docs/document/DocsTable'
import PageTitle from '@/components/common/PageTitle'
import { capitalizeFirstLetter } from '@/utils/formatName'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import MyDrawer from '@/components/layout/Drawer'
import CategoryTable from '@/components/admin/docs/category/CategoryTable'

export interface DocsPageProps {
  params: {
    appName: string
    docId?: string
  }
}

// 문서 목록페이지 (params로 appName 전달하여 문서 목록 테이블 렌더링) - SSR
export default async function DocsPage({
  params,
}: {
  params: Promise<DocsPageProps['params']>
}) {
  const { appName } = await params

  return (
    <>
      <div className='flex flex-col h-full p-4 sm:p-8'>
        <PageTitle title={`${capitalizeFirstLetter(appName)} 문서관리`} />
        <DocsTable app_name={appName} />
      </div>
      <Footer>
        <div className='flex items-center space-x-4'>
          <MyDrawer
            title='카테고리 관리'
            description='카테고리를 추가/수정/삭제합니다.'
          >
            <CategoryTable appName={appName} />
          </MyDrawer>
          <Link href={`/admin/${appName}/docs/add`} passHref>
            <Button variant='default'>
              <PlusCircle />
              문서 작성
            </Button>
          </Link>
        </div>
      </Footer>
    </>
  )
}
