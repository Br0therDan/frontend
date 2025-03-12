'use client';
import React from 'react';
import { DonutChartComp } from '@/components/services/dashboard/DonutCart';
import { BarChartComp } from '@/components/services/dashboard/BarChart';

export default function Dashboard() {


  return (
    <>
      <div className="flex gap-3">
        <DonutChartComp />
        <BarChartComp />
      </div>
    </>
  );
}
