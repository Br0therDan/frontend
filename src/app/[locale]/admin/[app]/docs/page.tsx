import DocsTable from '@/components/admin/docs/document/DocsTable'
import PageTitle from '@/components/common/PageTitle'
import { capitalizeFirstLetter } from '@/utils/formatName'
import React from 'react'

export default async function DocsPage({ params }: { params: Promise<{ app: string }> }) {
  const { app } = await params
  return (
    <div> 
        <PageTitle title={`${capitalizeFirstLetter(app)} Document Management`} />
        <DocsTable />
    </div>
  )
}
