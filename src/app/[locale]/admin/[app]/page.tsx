import PageTitle from '@/components/common/PageTitle';
import { capitalizeFirstLetter } from '@/utils/formatName';
import React from "react";

export default async function AppPage({ params }: { params: Promise<{ app: string }> }) {
    const { app } = await params;
  return (
    <div>
     <PageTitle title={`${capitalizeFirstLetter(app)} Dashboard`} />
    </div>
);
}
