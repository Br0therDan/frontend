import PageTitle from '@/components/common/PageTitle';
import { capitalizeFirstLetter } from '@/utils/formatName';
import React from "react";

export default function AppPage({ params }: { params: { app: string } }) {
    const { app } = params;
  return (
    <div>
     <PageTitle title={`${capitalizeFirstLetter(app)} Dashboard`} />
    </div>
);
}
