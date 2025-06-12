'use client';

import { ArrowUpCircle, BarChart3, Clock, DollarSign, GitBranch, Server, Shield, Users, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useParams } from 'next/navigation';

// This would normally come from an API
const client = {
  id: 1,
  name: 'Acme Corp',
  website: 'acme-corp.com',
  status: 'active',
  services: ['Website', 'Chatbot', 'Analytics'],
  lastDeployed: '2 hours ago',
  healthScore: 98,
  monthlyRevenue: '$12,500',
  activeUsers: '15.2k',
  uptime: '99.99%',
  responseTime: '120ms',
  errorRate: '0.02%',
  securityScore: 'A+',
  deployments: [
    { date: '2024-03-15', status: 'success', type: 'Website Update', duration: '8m', engineer: 'Sarah Chen' },
    { date: '2024-03-10', status: 'success', type: 'Chatbot Deployment', duration: '12m', engineer: 'Mike Johnson' }
  ],
  costs: {
    infrastructure: '$2,800',
    services: '$1,500',
    total: '$4,300',
    breakdown: [
      { name: 'AWS Services', amount: '$1,800' },
      { name: 'Database Hosting', amount: '$600' },
      { name: 'CDN', amount: '$400' },
      { name: 'API Gateway', amount: '$300' },
      { name: 'Monitoring Tools', amount: '$1,200' }
    ]
  },
  metrics: {
    apiCalls: '2.5M/month',
    dataProcessed: '500GB',
    storageUsed: '250GB',
    trends: {
      userGrowth: '+15%',
      revenueGrowth: '+12%',
      costGrowth: '+5%'
    }
  },
  serviceHealth: {
    website: { status: 'healthy', uptime: '99.99%', responseTime: '120ms' },
    chatbot: { status: 'healthy', uptime: '99.95%', responseTime: '150ms' },
    analytics: { status: 'warning', uptime: '99.8%', responseTime: '200ms' }
  },
  alerts: [
    { type: 'warning', message: 'Analytics service response time above threshold', timestamp: '1 hour ago' },
    { type: 'info', message: 'Scheduled maintenance upcoming', timestamp: '2 hours ago' }
  ],
  contacts: [
    { name: 'John Smith', role: 'CTO', email: 'john@acme-corp.com' },
    { name: 'Alice Johnson', role: 'Technical Lead', email: 'alice@acme-corp.com' }
  ]
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ClientDetailPage() {
  const params = useParams();
  
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {client.name}
            </h2>
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Users className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                {client.activeUsers} Active Users
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Clock className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                Last Deploy: {client.lastDeployed}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Shield className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                Security Score: {client.securityScore}
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
                    <dd className="text-lg font-semibold text-gray-900">{client.monthlyRevenue}</dd>
                    <dd className="text-sm text-green-600">{client.metrics.trends.revenueGrowth} from last month</dd>
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
                    <dt className="truncate text-sm font-medium text-gray-500">Infrastructure Cost</dt>
                    <dd className="text-lg font-semibold text-gray-900">{client.costs.total}</dd>
                    <dd className="text-sm text-yellow-600">{client.metrics.trends.costGrowth} from last month</dd>
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
                    <dd className="text-lg font-semibold text-gray-900">{client.activeUsers}</dd>
                    <dd className="text-sm text-green-600">{client.metrics.trends.userGrowth} from last month</dd>
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
                    <dd className="text-lg font-semibold text-gray-900">{client.healthScore}%</dd>
                    <dd className="text-sm text-gray-600">{client.uptime} Uptime</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Service Health */}
          <div className="grid grid-cols-1 gap-6">
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-base font-semibold leading-6 text-gray-900">Service Health</h3>
                <div className="mt-6 flow-root">
                  <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {Object.entries(client.serviceHealth).map(([service, health]) => (
                      <li key={service} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900 capitalize">{service}</p>
                            <div className="mt-1 flex items-center space-x-4">
                              <span className="flex items-center text-sm text-gray-500">
                                <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                                {health.responseTime}
                              </span>
                              <span className="flex items-center text-sm text-gray-500">
                                <ArrowUpCircle className="mr-1.5 h-4 w-4 text-gray-400" />
                                {health.uptime}
                              </span>
                            </div>
                          </div>
                          <div>
                            <span
                              className={classNames(
                                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                health.status === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              )}
                            >
                              {health.status === 'healthy' ? (
                                <CheckCircle className="mr-1 h-3 w-3" />
                              ) : (
                                <AlertTriangle className="mr-1 h-3 w-3" />
                              )}
                              {health.status}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Recent Deployments */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-base font-semibold leading-6 text-gray-900">Recent Deployments</h3>
                <div className="mt-6 flow-root">
                  <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {client.deployments.map((deployment, idx) => (
                      <li key={idx} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">{deployment.type}</p>
                            <div className="mt-1 flex items-center space-x-4">
                              <span className="flex items-center text-sm text-gray-500">
                                <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                                {deployment.date}
                              </span>
                              <span className="flex items-center text-sm text-gray-500">
                                <Users className="mr-1.5 h-4 w-4 text-gray-400" />
                                {deployment.engineer}
                              </span>
                            </div>
                          </div>
                          <div>
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              {deployment.duration}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Breakdown and Alerts */}
          <div className="grid grid-cols-1 gap-6">
            {/* Cost Breakdown */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-base font-semibold leading-6 text-gray-900">Cost Breakdown</h3>
                <div className="mt-6 flow-root">
                  <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {client.costs.breakdown.map((item) => (
                      <li key={item.name} className="py-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.amount}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-base font-semibold leading-6 text-gray-900">Recent Alerts</h3>
                <div className="mt-6 flow-root">
                  <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {client.alerts.map((alert, idx) => (
                      <li key={idx} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {alert.type === 'warning' ? (
                              <AlertTriangle className="h-5 w-5 text-yellow-400" />
                            ) : (
                              <CheckCircle className="h-5 w-5 text-blue-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                            <p className="text-sm text-gray-500">{alert.timestamp}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Key Contacts */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-base font-semibold leading-6 text-gray-900">Key Contacts</h3>
                <div className="mt-6 flow-root">
                  <ul role="list" className="-my-5 divide-y divide-gray-200">
                    {client.contacts.map((contact) => (
                      <li key={contact.email} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                            <p className="text-sm text-gray-500">{contact.role}</p>
                            <p className="text-sm text-gray-500">{contact.email}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 