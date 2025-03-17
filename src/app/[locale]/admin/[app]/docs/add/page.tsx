// path: src/app/[locale]/admin/[app]/docs/add/page.tsx

import DocumentForm from '@/components/admin/docs/document/DocsForm';
import React from "react";

// appId를 URL params 등에서 추출해 prop으로 전달한다고 가정합니다.
export default async function DocumentAddPage({ params }: { params: Promise<{ app: string }> }) {
  const { app } = await params;

  return (
    <div>
      {/* app prop 추가: 새 문서 생성 시 해당 앱에 소속됨 */}
      <DocumentForm mode="add" app_name={app} />
    </div>
  );
}