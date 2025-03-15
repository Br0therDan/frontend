import DocsTable from '@/components/admin/docs/document/DocsTable'
import PageTitle from '@/components/common/PageTitle'
import { capitalizeFirstLetter } from '@/utils/formatName'
import React from 'react'

export default function DocsPage({ params }: { params: { app: string } }) {
  const { app } = params
  return (
    <div> 
        <PageTitle title={`${capitalizeFirstLetter(app)} Document Management`} />
        <DocsTable />
    </div>
  )
}
