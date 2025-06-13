'use client';

import { 
  FileCode, Clock, GitBranch, Check, Users, ArrowUpCircle, 
  BarChart3, GitFork, Shield, Server, AlertTriangle, Settings,
  DollarSign, Terminal, Globe, Database, Activity, Code, Link,
  ExternalLink, PlayCircle, PauseCircle, RefreshCw, Book,
  MessageSquare, Edit, TrendingUp, Cpu, HardDrive, Zap
} from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

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
  healthEndpoint?: string;
  grafanaUrl?: string;
  sentryProjectId?: string;
  metrics?: Array<{
    id: number;
    name: string;
    value: string;
    unit?: string;
    timestamp: string;
    threshold?: number;
    cost?: number;
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

export default function ClientServiceDetailPage() {
  const params = useParams();
  const clientId = params.id;
  const serviceId = params.serviceId;
  
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchService() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/clients/${clientId}/services/${serviceId}`);
        if (!res.ok) throw new Error('Failed to fetch service');
        const data = await res.json();
        setService(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    if (clientId && serviceId) fetchService();
  }, [clientId, serviceId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading service...</div>;
  }
  if (error || !service) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error || 'Service not found'}</div>;
  }

  const ServiceIcon = serviceIcons[service.type] || serviceIcons.default;

  // Calculate performance metrics
  const avgResponseTime = service.metrics?.find(m => m.name.toLowerCase().includes('response'))?.value || 'N/A';
  const errorRate = service.metrics?.find(m => m.name.toLowerCase().includes('error'))?.value || '0%';
  const dailyRequests = service.metrics?.find(m => m.name.toLowerCase().includes('request'))?.value || 'N/A';
  const serverLoad = service.currentUsage ? `${service.currentUsage}%` : 'N/A';
  const memoryUsage = service.resourceAllocations?.[0]?.used ? `${service.resourceAllocations[0].used}GB` : 'N/A';
  
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb
            items={[
              { label: 'Clients', href: '/clients' },
              { label: service.client.name, href: `/clients/${clientId}` },
              { label: 'Services', href: `/clients/${clientId}?tab=services` },
              { label: service.name }
            ]}
          />
        </div>

        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center">
              <div className="rounded-lg bg-indigo-50 p-3">
                <ServiceIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                  {service.name}
                </h2>
                <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <GitBranch className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    {service.type}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Users className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    Client: {service.client.name}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Clock className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    Status: {service.status}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex space-x-3 md:ml-4 md:mt-0">
            {service.grafanaUrl && (
              <a
                href={service.grafanaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <BarChart3 className="mr-2 h-4 w-4 text-gray-500" />
                View Grafana
              </a>
            )}
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <Settings className="mr-2 h-4 w-4" />
              Configure Service
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowUpCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Health Score</p>
                <p className="text-xl font-semibold text-gray-900">{service.healthScore}%</p>
                <p className="text-sm text-gray-500">Last 24 hours</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Monthly Cost</p>
                <p className="text-xl font-semibold text-gray-900">
                  ${service.customPrice || service.costPerUnit || '0'}
                </p>
                <p className="text-sm text-gray-500">Current billing</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Response Time</p>
                <p className="text-xl font-semibold text-gray-900">{avgResponseTime}</p>
                <p className="text-sm text-gray-500">Average</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Error Rate</p>
                <p className="text-xl font-semibold text-gray-900">{errorRate}</p>
                <p className="text-sm text-gray-500">Last 30 days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Service Overview */}
            <div className="rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Service Overview</h3>
                <p className="mt-4 text-gray-500">
                  {service.description || `${service.type} service managed for ${service.client.name}`}
                </p>
                
                <h4 className="mt-6 text-sm font-medium text-gray-900">Service Features</h4>
                <ul className="mt-4 grid grid-cols-1 gap-4">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-sm text-gray-600">24/7 monitoring and alerting</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-sm text-gray-600">Automated scaling and load balancing</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-sm text-gray-600">Security scanning and updates</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-sm text-gray-600">Performance optimization</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-sm text-gray-600">Backup and disaster recovery</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Technical Configuration */}
            <div className="rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Technical Configuration</h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Resources</h4>
                    <ul className="mt-2 space-y-2">
                      <li className="text-sm text-gray-600">
                        <Cpu className="inline mr-1 h-4 w-4" />
                        CPU: {service.currentUsage ? `${service.currentUsage}%` : 'Auto-scaled'}
                      </li>
                      <li className="text-sm text-gray-600">
                        <HardDrive className="inline mr-1 h-4 w-4" />
                        Memory: {memoryUsage}
                      </li>
                      <li className="text-sm text-gray-600">
                        <Server className="inline mr-1 h-4 w-4" />
                        Capacity: {service.capacityLimit || 'Unlimited'}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Configuration</h4>
                    <ul className="mt-2 space-y-2">
                      <li className="text-sm text-gray-600">Type: {service.type}</li>
                      <li className="text-sm text-gray-600">Environment: Production</li>
                      <li className="text-sm text-gray-600">Region: US-East-1</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Deployments */}
            <div className="rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Recent Deployments</h3>
                <div className="mt-4 space-y-4">
                  {service.deployments && service.deployments.length > 0 ? (
                    service.deployments.map((deployment, idx) => (
                      <div key={idx} className="rounded-lg bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {deployment.status === 'success' ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : deployment.status === 'pending' ? (
                              <Clock className="h-5 w-5 text-yellow-500" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                            )}
                            <span className="ml-2 text-sm font-medium text-gray-900">{deployment.type}</span>
                          </div>
                          <span className="text-sm text-gray-500">{new Date(deployment.date).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          {deployment.description || 'Deployment completed successfully'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="ml-2 text-sm font-medium text-gray-900">Initial Service Setup</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Service was successfully deployed and is running
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Performance Metrics</h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Response Time</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{avgResponseTime}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Error Rate</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{errorRate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Server Load</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{serverLoad}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Memory Usage</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{memoryUsage}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Status */}
            <div className="rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Service Status</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                    <div>
                      <div className="flex items-center">
                        {service.status === 'active' ? (
                          <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400" />
                        ) : (
                          <div className="mr-2 h-2.5 w-2.5 rounded-full bg-red-400" />
                        )}
                        <span className="font-medium text-gray-900">Production</span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        <span className="mr-2">Health: {service.healthScore}%</span>
                        <span className="mr-2">•</span>
                        <span>Last updated: {new Date(service.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {service.healthEndpoint && (
                      <a
                        href={service.healthEndpoint}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                      >
                        View <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Monitoring & Analytics */}
            <div className="rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Monitoring & Analytics</h3>
                <div className="mt-4 space-y-3">
                  {service.grafanaUrl && (
                    <a
                      href={service.grafanaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center rounded-md bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100"
                    >
                      <BarChart3 className="mr-2 h-5 w-5 text-gray-400" />
                      Grafana Dashboard
                      <ExternalLink className="ml-auto h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  {service.sentryProjectId && (
                    <a
                      href={`https://sentry.io/projects/${service.sentryProjectId}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center rounded-md bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100"
                    >
                      <AlertTriangle className="mr-2 h-5 w-5 text-gray-400" />
                      Error Tracking
                      <ExternalLink className="ml-auto h-4 w-4 text-gray-400" />
                    </a>
                  )}
                  <button className="flex w-full items-center rounded-md bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100">
                    <Activity className="mr-2 h-5 w-5 text-gray-400" />
                    Performance Logs
                  </button>
                </div>
              </div>
            </div>

            {/* Resource Usage History */}
            {service.resourceAllocations && service.resourceAllocations.length > 0 && (
              <div className="rounded-lg bg-white shadow">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">Resource Usage History</h3>
                  <div className="mt-4 space-y-4">
                    {service.resourceAllocations.map((allocation, idx) => (
                      <div key={idx} className="rounded-lg bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-900">
                                {allocation.used}/{allocation.allocated} units
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              <span>{new Date(allocation.timestamp).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-900">${allocation.cost}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 