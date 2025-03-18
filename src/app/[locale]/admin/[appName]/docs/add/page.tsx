// path: src/app/[locale]/admin/[appName]/docs/add/page.tsx

import React from "react";
import DocumentForm from '@/components/admin/docs/document/DocsForm';
import { DocsPageProps } from '../page';

// 문서 작성 페이지 (params로 appName 전달) - SSR
export default function DocumentAddPage({ 
  params,
}: { 
  params: DocsPageProps['params']
}) {
  const { appName } = params;
  return (
    <div>
      <DocumentForm 
        mode="add" 
        app_name={appName} 
      />
    </div>
  );
}