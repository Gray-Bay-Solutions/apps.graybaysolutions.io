'use client';

import { Suspense } from 'react';
import SupportDashboard from '@/components/support/SupportDashboard';

export default function SupportPage() {
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div>Loading...</div>}>
          <SupportDashboard />
        </Suspense>
      </div>
    </div>
  );
} 