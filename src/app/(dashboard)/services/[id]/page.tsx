'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  ArrowUpCircle, 
  BarChart3, 
  Clock, 
  DollarSign, 
  GitBranch, 
  Server, 
  Shield, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Globe,
  MessageSquare,
  Database,
  Edit,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
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
  capacityLimit?: number;
  currentUsage?: number;
  createdAt: string;
  updatedAt: string;
  metrics?: Array<{
    id: number;
    name: string;
    value: string;
    unit?: string;
    timestamp: string;
  }>;
  resourceAllocations?: Array<{
    id: number;
    allocated: number;
    used: number;
    cost: number;
    timestamp: string;
  }>;
  deployments?: Array<{
    id: number;
    date: string;
    status: string;
    type: string;
    description?: string;
  }>;
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

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = params.id;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchService() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/services/${serviceId}`);
        if (!res.ok) throw new Error('Failed to fetch service');
        const data = await res.json();
        setService(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    if (serviceId) fetchService();
  }, [serviceId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading service...</div>;
  }
  if (error || !service) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error || 'Service not found'}</div>;
  }

  const ServiceIcon = serviceIcons[service.type] || serviceIcons.default;

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb
            items={[
              { label: 'Services', href: '/services' },
              { label: service.name }
            ]}
          />
        </div>

        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className={classNames(
                  'rounded-lg p-3',
                  service.healthScore >= 90 ? 'bg-green-500' : 
                  service.healthScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                )}>
                  <ServiceIcon className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                  {service.name}
                </h2>
                <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Server className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    {service.type}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Clock className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    Status: {service.status}
                  </div>
                  <Link 
                    href={`/clients/${service.clientId}`}
                    className="mt-2 flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    <Users className="mr-1.5 h-5 w-5 flex-shrink-0" />
                    {service.client.name}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <Link
              href={`/clients/${service.clientId}?tab=services`}
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <Edit className="mr-2 h-4 w-4 text-gray-500" />
              Manage Service
            </Link>
            <button
              type="button"
              className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              View Metrics
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ArrowUpCircle className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">Health Score</dt>
                    <dd className="text-lg font-semibold text-gray-900">{service.healthScore}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">Monthly Cost</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      ${service.customPrice || service.costPerUnit || '-'}
                    </dd>
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
                    <dt className="truncate text-sm font-medium text-gray-500">Usage</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {service.currentUsage !== undefined 
                        ? `${service.currentUsage}%`
                        : '-'
                      }
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Shield className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">Status</dt>
                    <dd className="text-lg font-semibold text-gray-900 capitalize">{service.status}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Service Details */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">Service Details</h3>
              <div className="mt-6">
                {service.description && (
                  <div className="mb-6">
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900">{service.description}</dd>
                  </div>
                )}
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">{service.type}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(service.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(service.updatedAt).toLocaleDateString()}
                    </dd>
                  </div>
                  {service.capacityLimit && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Capacity Limit</dt>
                      <dd className="mt-1 text-sm text-gray-900">{service.capacityLimit}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>

          {/* Recent Metrics */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">Recent Metrics</h3>
              <div className="mt-6 flow-root">
                {service.metrics && service.metrics.length > 0 ? (
                  <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {service.metrics.map((metric) => (
                      <li key={metric.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">{metric.name}</p>
                            <p className="truncate text-sm text-gray-500">
                              {new Date(metric.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              {metric.value} {metric.unit}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No metrics available</p>
                )}
              </div>
            </div>
          </div>

          {/* Resource Usage */}
          {service.resourceAllocations && service.resourceAllocations.length > 0 && (
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-base font-semibold leading-6 text-gray-900">Resource Usage</h3>
                <div className="mt-6 flow-root">
                  <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {service.resourceAllocations.map((allocation) => (
                      <li key={allocation.id} className="py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Allocated: {allocation.allocated}</p>
                            <p className="text-sm text-gray-500">Used: {allocation.used}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">${allocation.cost}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(allocation.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Recent Deployments */}
          {service.deployments && service.deployments.length > 0 && (
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-base font-semibold leading-6 text-gray-900">Recent Deployments</h3>
                <div className="mt-6 flow-root">
                  <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {service.deployments.map((deployment) => (
                      <li key={deployment.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">{deployment.type}</p>
                            <p className="truncate text-sm text-gray-500">
                              {deployment.description || 'No description'}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={classNames(
                                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                deployment.status === 'success'
                                  ? 'bg-green-100 text-green-800'
                                  : deployment.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              )}
                            >
                              {deployment.status}
                            </span>
                            <p className="mt-1 text-sm text-gray-500">
                              {new Date(deployment.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
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