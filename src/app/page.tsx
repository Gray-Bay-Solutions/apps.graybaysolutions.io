import { Activity, Users, Server, AlertTriangle, TrendingUp, Shield, Clock, Database, Zap } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { 
    name: 'System Health', 
    value: '98.5%', 
    change: '-0.5%', 
    changeType: 'negative',
    details: 'Overall platform health score',
    icon: Activity
  },
  { 
    name: 'Active Clients', 
    value: '24', 
    change: '+4.75%', 
    changeType: 'positive',
    details: '$1.2M MRR',
    icon: Users
  },
  { 
    name: 'Infrastructure Cost', 
    value: '$45.2K', 
    change: '+2.5%', 
    changeType: 'negative',
    details: 'Monthly cloud spend',
    icon: TrendingUp
  },
  { 
    name: 'Security Score', 
    value: 'A+', 
    change: 'Stable', 
    changeType: 'neutral',
    details: 'Last scan: 2h ago',
    icon: Shield
  },
];

const criticalMetrics = [
  {
    name: 'Response Time',
    value: '185ms',
    target: '< 200ms',
    status: 'healthy',
    trend: 'improving',
    details: 'Avg. across all services'
  },
  {
    name: 'Error Rate',
    value: '0.02%',
    target: '< 0.1%',
    status: 'healthy',
    trend: 'stable',
    details: 'Last 24 hours'
  },
  {
    name: 'API Usage',
    value: '3.2M',
    target: '5M daily',
    status: 'healthy',
    trend: 'increasing',
    details: 'Requests today'
  },
  {
    name: 'Database Load',
    value: '65%',
    target: '< 75%',
    status: 'warning',
    trend: 'increasing',
    details: 'Peak hours: 85%'
  }
];

const alerts = [
  {
    id: 1,
    name: 'High CPU Usage',
    description: 'Server CPU usage exceeded 80% threshold',
    timestamp: '5 minutes ago',
    status: 'critical',
    impact: 'Performance degradation possible',
    service: 'API Gateway',
    action: 'Auto-scaling initiated'
  },
  {
    id: 2,
    name: 'SSL Certificate Expiring',
    description: 'Certificate for client-site-1.com expires in 15 days',
    timestamp: '1 hour ago',
    status: 'warning',
    impact: 'Security compliance at risk',
    service: 'Websites',
    action: 'Renewal scheduled'
  },
  {
    id: 3,
    name: 'Database Replication Lag',
    description: 'Increased lag in database replication',
    timestamp: '15 minutes ago',
    status: 'warning',
    impact: 'Data consistency delay',
    service: 'Database Services',
    action: 'Investigation ongoing'
  }
];

const quickActions = [
  { name: 'View System Health', href: '/services', icon: Activity },
  { name: 'Security Dashboard', href: '/services/5', icon: Shield },
  { name: 'Cost Analysis', href: '/billing', icon: TrendingUp },
  { name: 'Performance Metrics', href: '/services/6', icon: Zap },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Dashboard() {
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-700">
              Real-time overview of platform health, business metrics, and critical operations.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:flex space-x-3">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <action.icon className="mr-2 h-4 w-4 text-gray-500" />
                {action.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Key Stats */}
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
            >
              <dt>
                <div className="absolute rounded-md bg-indigo-500 p-3">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
              </dt>
              <dd className="ml-16 flex flex-col pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                <div className="flex items-baseline">
                  <p
                    className={classNames(
                      item.changeType === 'positive' ? 'text-green-600' : 
                      item.changeType === 'negative' ? 'text-red-600' : 'text-gray-600',
                      'text-sm font-semibold'
                    )}
                  >
                    {item.change}
                  </p>
                  <p className="ml-2 text-sm text-gray-500">{item.details}</p>
                </div>
              </dd>
            </div>
          ))}
        </dl>

        {/* Critical Metrics */}
        <div className="mt-8">
          <h2 className="text-lg font-medium leading-6 text-gray-900">Critical Service Metrics</h2>
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {criticalMetrics.map((metric) => (
              <div
                key={metric.name}
                className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6"
              >
                <dt className="truncate text-sm font-medium text-gray-500">{metric.name}</dt>
                <dd className="mt-1">
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
                    <p className="ml-2 text-sm text-gray-500">Target: {metric.target}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className={classNames(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        metric.status === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      )}
                    >
                      {metric.status}
                    </span>
                    <p className="text-sm text-gray-500">{metric.details}</p>
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Recent Alerts */}
        <div className="mt-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-lg font-medium leading-6 text-gray-900">Critical Alerts</h2>
            <div className="mt-4 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Alert
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Service
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Impact
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Action Taken
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Status
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Time
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {alerts.map((alert) => (
                          <tr key={alert.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {alert.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {alert.service}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {alert.impact}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {alert.action}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <span
                                className={classNames(
                                  'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                                  alert.status === 'critical'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                )}
                              >
                                {alert.status}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {alert.timestamp}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
