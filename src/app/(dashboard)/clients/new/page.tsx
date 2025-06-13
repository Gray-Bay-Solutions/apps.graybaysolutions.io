'use client';

import NewClientForm from '@/components/clients/NewClientForm';
import Breadcrumb from '@/components/Breadcrumb';

export default function NewClientPage() {
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb
            items={[
              { label: 'Clients', href: '/clients' },
              { label: 'New Client' }
            ]}
          />
        </div>

        <div className="sm:flex sm:items-center mb-8">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">New Client</h1>
            <p className="mt-2 text-sm text-gray-700">
              Create a new client profile and configure their services.
            </p>
          </div>
        </div>

        <NewClientForm />
      </div>
    </div>
  );
} 