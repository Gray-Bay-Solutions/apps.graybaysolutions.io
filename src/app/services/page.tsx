import { Globe, MessageSquare, BarChart3, AlertTriangle, Database, Shield, Server } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    id: 1,
    name: 'Websites',
    description: 'Client website hosting and management',
    icon: Globe,
    activeCount: 24,
    totalCount: 25,
    metrics: [
      { name: 'Uptime', value: '99.99%' },
      { name: 'Response Time', value: '187ms' },
      { name: 'Error Rate', value: '0.01%' },
    ],
    status: 'healthy',
  },
  {
    id: 2,
    name: 'Chatbots',
    description: 'AI-powered customer service bots',
    icon: MessageSquare,
    activeCount: 15,
    totalCount: 18,
    metrics: [
      { name: 'Uptime', value: '99.95%' },
      { name: 'Response Time', value: '245ms' },
      { name: 'Resolution Rate', value: '87%' },
    ],
    status: 'warning',
  },
  {
    id: 3,
    name: 'Analytics',
    description: 'Real-time performance tracking',
    icon: BarChart3,
    activeCount: 20,
    totalCount: 20,
    metrics: [
      { name: 'Data Processing', value: '98.5%' },
      { name: 'Latency', value: '156ms' },
      { name: 'Accuracy', value: '99.99%' },
    ],
    status: 'healthy',
  },
  {
    id: 4,
    name: 'Database Services',
    description: 'Core database infrastructure and data management',
    icon: Database,
    activeCount: 8,
    totalCount: 8,
    metrics: [
      { name: 'Uptime', value: '100%' },
      { name: 'Query Time', value: '45ms' },
      { name: 'Backup Status', value: '100%' },
    ],
    status: 'healthy',
  },
  {
    id: 5,
    name: 'Security & Authentication',
    description: 'Identity management and security services',
    icon: Shield,
    activeCount: 12,
    totalCount: 12,
    metrics: [
      { name: 'Auth Success', value: '99.99%' },
      { name: 'Token Time', value: '25ms' },
      { name: 'Security Status', value: 'Pass' },
    ],
    status: 'healthy',
  },
  {
    id: 6,
    name: 'API Gateway',
    description: 'API management and request routing',
    icon: Server,
    activeCount: 156,
    totalCount: 156,
    metrics: [
      { name: 'Success Rate', value: '99.98%' },
      { name: 'Latency', value: '65ms' },
      { name: 'Cache Hits', value: '92%' },
    ],
    status: 'healthy',
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ServicesPage() {
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Services</h1>
            <p className="mt-2 text-sm text-gray-700">
              Comprehensive monitoring dashboard for all platform services and infrastructure.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add service
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.id}`}
              className="relative overflow-hidden rounded-lg bg-white shadow hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={classNames(
                      'rounded-md p-3',
                      service.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
                    )}>
                      <service.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-500">{service.description}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Active: {service.activeCount}/{service.totalCount}
                    </div>
                    <div>
                      <span
                        className={classNames(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                          service.status === 'healthy'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        )}
                      >
                        {service.status === 'warning' && (
                          <AlertTriangle className="mr-1 h-4 w-4" />
                        )}
                        {service.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-200">
                  <dl className="divide-y divide-gray-200">
                    {service.metrics.map((metric) => (
                      <div key={metric.name} className="flex justify-between py-3">
                        <dt className="text-sm text-gray-500">{metric.name}</dt>
                        <dd className="text-sm font-medium text-gray-900">{metric.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 