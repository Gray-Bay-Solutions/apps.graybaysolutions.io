'use client';

import { Globe, MessageSquare, BarChart3, AlertTriangle, Database, Shield, Server, Users, Plus, Eye } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';

interface Service {
  id: number;
  name: string;
  type: string;
  description?: string;
  status: string;
  healthScore: number;
  clientId: number;
  client: {
    id: number;
    name: string;
    website?: string;
  };
  costPerUnit?: number;
  customPrice?: number;
  metrics?: Array<{
    id: number;
    name: string;
    value: string;
    unit?: string;
    timestamp: string;
  }>;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const serviceIcons: Record<string, any> = {
  website: Globe,
  chatbot: MessageSquare,
  analytics: BarChart3,
  database: Database,
  security: Shield,
  api: Server,
  default: Server,
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = selectedType === 'all' 
    ? services 
    : services.filter(service => service.type === selectedType);

  const serviceTypeStats = services.reduce((acc, service) => {
    acc[service.type] = (acc[service.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const serviceTypes = [
    { id: 'all', name: 'All Services', count: services.length },
    { id: 'website', name: 'Websites', count: serviceTypeStats.website || 0 },
    { id: 'chatbot', name: 'Chatbots', count: serviceTypeStats.chatbot || 0 },
    { id: 'analytics', name: 'Analytics', count: serviceTypeStats.analytics || 0 },
    { id: 'database', name: 'Database', count: serviceTypeStats.database || 0 },
    { id: 'security', name: 'Security', count: serviceTypeStats.security || 0 },
    { id: 'api', name: 'API Gateway', count: serviceTypeStats.api || 0 },
  ];

  const healthyServices = services.filter(s => s.healthScore >= 90).length;
  const warningServices = services.filter(s => s.healthScore >= 70 && s.healthScore < 90).length;
  const criticalServices = services.filter(s => s.healthScore < 70).length;
  const activeServices = services.filter(s => s.status === 'active').length;

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Breadcrumb
            items={[
              { label: 'Services' }
            ]}
          />
        </div>

        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Services</h1>
            <p className="mt-2 text-sm text-gray-700">
              Comprehensive monitoring dashboard for all platform services and infrastructure across all clients.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              href="/clients"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Manage Client Services
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white shadow p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Server className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Services</dt>
                  <dd className="text-lg font-semibold text-gray-900">{services.length}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white shadow p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Healthy</dt>
                  <dd className="text-lg font-semibold text-gray-900">{healthyServices}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white shadow p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-yellow-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Warning</dt>
                  <dd className="text-lg font-semibold text-gray-900">{warningServices}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white shadow p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-red-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Critical</dt>
                  <dd className="text-lg font-semibold text-gray-900">{criticalServices}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {serviceTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={classNames(
                    selectedType === type.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium'
                  )}
                >
                  {type.name} ({type.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Loading/Error States */}
        {loading && <div className="mt-8 text-center text-gray-500">Loading services...</div>}
        {error && <div className="mt-8 text-center text-red-500">{error}</div>}

        {/* Services Grid */}
        {!loading && !error && (
          <div className="mt-8">
            {filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <Server className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No services</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedType === 'all' 
                    ? 'No services have been created yet.'
                    : `No ${selectedType} services found.`
                  }
                </p>
                <div className="mt-6">
                  <Link
                    href="/clients"
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service via Client Management
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredServices.map((service) => {
                  const ServiceIcon = serviceIcons[service.type] || serviceIcons.default;
                  
                  return (
                    <div
                      key={service.id}
                      className="relative overflow-hidden rounded-lg bg-white shadow hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className={classNames(
                              'rounded-md p-3',
                              service.healthScore >= 90 ? 'bg-green-500' : 
                              service.healthScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            )}>
                              <ServiceIcon className="h-6 w-6 text-white" aria-hidden="true" />
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="text-lg font-medium text-gray-900">
                              {service.name}
                            </h3>
                            <p className="text-sm text-gray-500">{service.description || `${service.type} service`}</p>
                            <Link 
                              href={`/clients/${service.clientId}`}
                              className="text-sm text-indigo-600 hover:text-indigo-900"
                            >
                              {service.client.name}
                            </Link>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              Status: {service.status}
                            </div>
                            <div>
                              <span
                                className={classNames(
                                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                  service.healthScore >= 90
                                    ? 'bg-green-100 text-green-800'
                                    : service.healthScore >= 70
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                )}
                              >
                                {service.healthScore >= 90 ? 'Healthy' : 
                                 service.healthScore >= 70 ? 'Warning' : 'Critical'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 border-t border-gray-200">
                          <dl className="divide-y divide-gray-200">
                            <div className="flex justify-between py-3">
                              <dt className="text-sm text-gray-500">Health Score</dt>
                              <dd className="text-sm font-medium text-gray-900">{service.healthScore}%</dd>
                            </div>
                            {service.customPrice && (
                              <div className="flex justify-between py-3">
                                <dt className="text-sm text-gray-500">Monthly Cost</dt>
                                <dd className="text-sm font-medium text-gray-900">${service.customPrice}</dd>
                              </div>
                            )}
                            {service.metrics && service.metrics.length > 0 && (
                              <div className="flex justify-between py-3">
                                <dt className="text-sm text-gray-500">Last Metric</dt>
                                <dd className="text-sm font-medium text-gray-900">
                                  {service.metrics[0].value} {service.metrics[0].unit}
                                </dd>
                              </div>
                            )}
                          </dl>
                        </div>

                        <div className="mt-4 flex space-x-3">
                          <Link
                            href={`/clients/${service.clientId}`}
                            className="flex-1 text-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                          >
                            <Eye className="inline mr-1 h-4 w-4" />
                            View Client
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 