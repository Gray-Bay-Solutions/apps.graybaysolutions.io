'use client';

import { ArrowUpCircle, BarChart3, Clock, DollarSign, GitBranch, Server, Shield, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import ServiceManagement from '@/components/clients/ServiceManagement';
import ClientBillingSummary from '@/components/invoicing/ClientBillingSummary';
import ClientTicketSummary from '@/components/support/ClientTicketSummary';
import { useEffect, useState } from 'react';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ClientDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const clientId = params.id;
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check for tab parameter in URL
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'services', 'tickets', 'contacts'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchClient() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/clients/${clientId}`);
        if (!res.ok) throw new Error('Failed to fetch client');
        const data = await res.json();
        setClient(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    if (clientId) fetchClient();
  }, [clientId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading client...</div>;
  }
  if (error || !client) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error || 'Client not found'}</div>;
  }

  const TABS = [
    { id: 'overview', name: 'Overview' },
    { id: 'services', name: 'Services' },
    { id: 'billing', name: 'Billing' },
    { id: 'tickets', name: 'Tickets' },
    { id: 'contacts', name: 'Contacts' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb
            items={[
              { label: 'Clients', href: '/clients' },
              { label: client.name || `Client ${clientId}` }
            ]}
          />
        </div>

        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {client.name}
            </h2>
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Users className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                {client.activeUsers ? `${client.activeUsers} Active Users` : 'No active user data'}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Clock className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                Status: {client.status || 'active'}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Shield className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                Security Score: {client.securityScore || '-'}
              </div>
            </div>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <BarChart3 className="mr-2 h-4 w-4 text-gray-500" />
              View Reports
            </button>
            <button
              type="button"
              className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <GitBranch className="mr-2 h-4 w-4" />
              Deploy Changes
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">Monthly Revenue</dt>
                    <dd className="text-lg font-semibold text-gray-900">{client.monthlyRevenue || '-'}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Server className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">Services</dt>
                    <dd className="text-lg font-semibold text-gray-900">{client.services?.length || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">Active Users</dt>
                    <dd className="text-lg font-semibold text-gray-900">{client.activeUsers || '-'}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ArrowUpCircle className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">Overall Health</dt>
                    <dd className="text-lg font-semibold text-gray-900">{client.healthScore ? `${client.healthScore}%` : '-'}</dd>
                    <dd className="text-sm text-gray-600">{client.uptime ? `${client.uptime} Uptime` : '-'}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={classNames(
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium'
                  )}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Service Health Summary */}
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-6">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">Services Overview</h3>
                  <div className="mt-6 flow-root">
                    <ul role="list" className="-my-5 divide-y divide-gray-200">
                      {client.services && client.services.length > 0 ? (
                        client.services.slice(0, 5).map((service: any) => (
                          <li key={service.id} className="py-4">
                            <div className="flex items-center space-x-4">
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900 capitalize">{service.name}</p>
                                <div className="mt-1 flex items-center space-x-4">
                                  <span className="flex items-center text-sm text-gray-500">
                                    <ArrowUpCircle className="mr-1.5 h-4 w-4 text-gray-400" />
                                    {service.status || 'active'}
                                  </span>
                                  <span className="flex items-center text-sm text-gray-500">
                                    <Server className="mr-1.5 h-4 w-4 text-gray-400" />
                                    {service.type}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <span
                                  className={classNames(
                                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                    service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                  )}
                                >
                                  {service.status === 'active' ? (
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                  ) : (
                                    <AlertTriangle className="mr-1 h-3 w-3" />
                                  )}
                                  {service.status || 'active'}
                                </span>
                              </div>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="py-4 text-gray-400">No services</li>
                      )}
                    </ul>
                    {client.services && client.services.length > 5 && (
                      <div className="mt-4">
                        <button
                          onClick={() => setActiveTab('services')}
                          className="text-sm text-indigo-600 hover:text-indigo-900"
                        >
                          View all {client.services.length} services →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Key Contacts */}
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-6">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">Key Contacts</h3>
                  <div className="mt-6 flow-root">
                    <ul role="list" className="-my-5 divide-y divide-gray-200">
                      {client.contacts && client.contacts.length > 0 ? (
                        client.contacts.map((contact: any) => (
                          <li key={contact.id} className="py-4">
                            <div className="flex items-center space-x-4">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                                <p className="text-sm text-gray-500">{contact.role}</p>
                                <p className="text-sm text-gray-500">{contact.email}</p>
                              </div>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="py-4 text-gray-400">No contacts</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <ServiceManagement clientId={parseInt(clientId as string)} clientName={client.name} />
          )}

          {activeTab === 'billing' && (
            <ClientBillingSummary clientId={parseInt(clientId as string)} clientName={client.name} />
          )}

          {activeTab === 'tickets' && (
            <ClientTicketSummary clientId={parseInt(clientId as string)} clientName={client.name} />
          )}

          {activeTab === 'contacts' && (
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-base font-semibold leading-6 text-gray-900">All Contacts</h3>
                <div className="mt-6 flow-root">
                  <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {client.contacts && client.contacts.length > 0 ? (
                      client.contacts.map((contact: any) => (
                        <li key={contact.id} className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                              <p className="text-sm text-gray-500">{contact.role}</p>
                              <p className="text-sm text-gray-500">{contact.email}</p>
                              {contact.phone && (
                                <p className="text-sm text-gray-500">{contact.phone}</p>
                              )}
                              {contact.isPrimary && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Primary Contact
                                </span>
                              )}
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="py-4 text-gray-400">No contacts</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 