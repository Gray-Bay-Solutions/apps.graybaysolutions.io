'use client';

import { Suspense } from 'react';
import ClientDetailContent from './ClientDetailContent';

export default function ClientDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading client...</div>}>
      <ClientDetailContent />
    </Suspense>
  );
} 