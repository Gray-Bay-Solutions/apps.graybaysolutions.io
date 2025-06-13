'use client';

import { Suspense } from 'react';
import BillingDashboard from '@/components/invoicing/BillingDashboard';

export default function BillingPage() {
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div>Loading...</div>}>
          <BillingDashboard />
        </Suspense>
      </div>
    </div>
  );
} 