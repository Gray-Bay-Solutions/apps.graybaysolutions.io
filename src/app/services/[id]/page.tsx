'use client';

import { notFound } from 'next/navigation';
import { AlertTriangle, Activity, Clock, AlertCircle, Globe, MessageSquare, BarChart3, Bot, Database, Shield, Server } from 'lucide-react';

interface Metric {
  name: string;
  value: string;
  history: number[];
}

interface Alert {
  id: number;
  type: 'info' | 'warning';
  message: string;
  timestamp: string;
}

interface SentryIssue {
  id: string;
  level: 'error' | 'warning';
  message: string;
  count: number;
  lastSeen: string;
}

interface Service {
  id: number;
  name: string;
  description: string;
  status: 'healthy' | 'warning';
  grafanaUrl: string;
  sentryProjectId: string;
  healthEndpoint: string;
  metrics: Metric[];
  recentAlerts: Alert[];
  sentryIssues: SentryIssue[];
}

// This would come from your API/database in a real app
const services: Record<number, Service> = {
  1: {
    id: 1,
    name: 'Websites',
    description: 'Client website hosting and management',
    status: 'healthy',
    grafanaUrl: 'https://grafana.example.com/d/websites',
    sentryProjectId: 'websites-123',
    healthEndpoint: '/health/websites',
    metrics: [
      { name: 'Uptime', value: '99.99%', history: [99.9, 99.95, 99.99, 99.98, 99.99] },
      { name: 'Response Time', value: '187ms', history: [190, 185, 187, 189, 187] },
      { name: 'Error Rate', value: '0.01%', history: [0.02, 0.015, 0.01, 0.01, 0.01] },
      { name: 'Core Web Vitals Score', value: '98', history: [95, 96, 97, 98, 98] },
      { name: 'SSL Certificate Health', value: '100%', history: [100, 100, 100, 100, 100] }
    ],
    recentAlerts: [
      { id: 1, type: 'info', message: 'Scheduled maintenance completed', timestamp: '2024-03-20T10:00:00Z' },
      { id: 2, type: 'warning', message: 'High latency detected', timestamp: '2024-03-19T15:30:00Z' }
    ],
    sentryIssues: [
      { id: 'ERR-123', level: 'error', message: '500 Internal Server Error in /api/data', count: 3, lastSeen: '2024-03-20T08:15:00Z' },
      { id: 'WARN-456', level: 'warning', message: 'Slow database query detected', count: 5, lastSeen: '2024-03-20T09:30:00Z' }
    ]
  },
  2: {
    id: 2,
    name: 'Chatbots',
    description: 'AI-powered customer service bots',
    status: 'warning',
    grafanaUrl: 'https://grafana.example.com/d/chatbots',
    sentryProjectId: 'chatbots-456',
    healthEndpoint: '/health/chatbots',
    metrics: [
      { name: 'Uptime', value: '99.95%', history: [99.95, 99.95, 99.96, 99.94, 99.95] },
      { name: 'Response Time', value: '245ms', history: [220, 235, 245, 242, 245] },
      { name: 'Error Rate', value: '0.05%', history: [0.03, 0.04, 0.05, 0.05, 0.05] },
      { name: 'User Satisfaction', value: '4.7/5', history: [4.6, 4.6, 4.7, 4.7, 4.7] },
      { name: 'Resolution Rate', value: '87%', history: [85, 86, 86, 87, 87] }
    ],
    recentAlerts: [
      { id: 1, type: 'warning', message: 'NLP processing latency spike', timestamp: '2024-03-20T11:30:00Z' },
      { id: 2, type: 'info', message: 'AI model update completed', timestamp: '2024-03-19T09:00:00Z' }
    ],
    sentryIssues: [
      { id: 'ERR-789', level: 'error', message: 'NLP processing timeout', count: 12, lastSeen: '2024-03-20T11:25:00Z' },
      { id: 'WARN-101', level: 'warning', message: 'High memory usage in bot instance', count: 3, lastSeen: '2024-03-20T10:45:00Z' }
    ]
  },
  3: {
    id: 3,
    name: 'Analytics',
    description: 'Real-time performance tracking and business intelligence',
    status: 'healthy',
    grafanaUrl: 'https://grafana.example.com/d/analytics',
    sentryProjectId: 'analytics-789',
    healthEndpoint: '/health/analytics',
    metrics: [
      { name: 'Data Processing', value: '98.5%', history: [98.2, 98.3, 98.4, 98.5, 98.5] },
      { name: 'Latency', value: '156ms', history: [160, 158, 157, 156, 156] },
      { name: 'Error Rate', value: '0.02%', history: [0.02, 0.02, 0.02, 0.02, 0.02] },
      { name: 'Data Accuracy', value: '99.99%', history: [99.98, 99.98, 99.99, 99.99, 99.99] },
      { name: 'Storage Usage', value: '78%', history: [75, 76, 77, 77, 78] }
    ],
    recentAlerts: [
      { id: 1, type: 'info', message: 'Daily data aggregation completed', timestamp: '2024-03-20T12:00:00Z' },
      { id: 2, type: 'info', message: 'New analytics dashboard deployed', timestamp: '2024-03-19T16:45:00Z' }
    ],
    sentryIssues: [
      { id: 'WARN-202', level: 'warning', message: 'Slow query performance in dashboard', count: 2, lastSeen: '2024-03-20T11:00:00Z' }
    ]
  },
  4: {
    id: 4,
    name: 'Database Services',
    description: 'Core database infrastructure and data management',
    status: 'healthy',
    grafanaUrl: 'https://grafana.example.com/d/databases',
    sentryProjectId: 'databases-012',
    healthEndpoint: '/health/databases',
    metrics: [
      { name: 'Uptime', value: '100%', history: [100, 100, 100, 100, 100] },
      { name: 'Query Response Time', value: '45ms', history: [48, 47, 46, 45, 45] },
      { name: 'Connection Pool Usage', value: '65%', history: [62, 63, 64, 65, 65] },
      { name: 'Backup Status', value: '100%', history: [100, 100, 100, 100, 100] },
      { name: 'Replication Lag', value: '10ms', history: [12, 11, 11, 10, 10] }
    ],
    recentAlerts: [
      { id: 1, type: 'info', message: 'Automated backup completed', timestamp: '2024-03-20T13:00:00Z' },
      { id: 2, type: 'info', message: 'Index optimization completed', timestamp: '2024-03-19T14:30:00Z' }
    ],
    sentryIssues: [
      { id: 'WARN-303', level: 'warning', message: 'Increasing storage usage trend', count: 1, lastSeen: '2024-03-20T12:30:00Z' }
    ]
  },
  5: {
    id: 5,
    name: 'Security & Authentication',
    description: 'Identity management and security services',
    status: 'healthy',
    grafanaUrl: 'https://grafana.example.com/d/security',
    sentryProjectId: 'security-345',
    healthEndpoint: '/health/security',
    metrics: [
      { name: 'Auth Success Rate', value: '99.99%', history: [99.98, 99.98, 99.99, 99.99, 99.99] },
      { name: 'Token Validation Time', value: '25ms', history: [27, 26, 26, 25, 25] },
      { name: 'Failed Login Attempts', value: '0.1%', history: [0.12, 0.11, 0.10, 0.10, 0.10] },
      { name: 'SSL/TLS Health', value: '100%', history: [100, 100, 100, 100, 100] },
      { name: 'Security Scan Status', value: 'Pass', history: [100, 100, 100, 100, 100] }
    ],
    recentAlerts: [
      { id: 1, type: 'info', message: 'Security scan completed', timestamp: '2024-03-20T14:00:00Z' },
      { id: 2, type: 'info', message: 'Certificate rotation completed', timestamp: '2024-03-19T13:15:00Z' }
    ],
    sentryIssues: []
  },
  6: {
    id: 6,
    name: 'API Gateway',
    description: 'API management and request routing',
    status: 'healthy',
    grafanaUrl: 'https://grafana.example.com/d/api-gateway',
    sentryProjectId: 'api-678',
    healthEndpoint: '/health/api-gateway',
    metrics: [
      { name: 'Request Success Rate', value: '99.98%', history: [99.97, 99.97, 99.98, 99.98, 99.98] },
      { name: 'Latency', value: '65ms', history: [68, 67, 66, 65, 65] },
      { name: 'Rate Limiting', value: '0.5%', history: [0.6, 0.5, 0.5, 0.5, 0.5] },
      { name: 'Cache Hit Rate', value: '92%', history: [90, 91, 91, 92, 92] },
      { name: 'Active Routes', value: '156', history: [152, 153, 154, 155, 156] }
    ],
    recentAlerts: [
      { id: 1, type: 'info', message: 'New API version deployed', timestamp: '2024-03-20T15:00:00Z' },
      { id: 2, type: 'info', message: 'Route configuration updated', timestamp: '2024-03-19T12:00:00Z' }
    ],
    sentryIssues: [
      { id: 'WARN-404', level: 'warning', message: 'Deprecated API version still in use', count: 1, lastSeen: '2024-03-20T14:00:00Z' }
    ]
  }
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ServicePage({ params }: { params: { id: string } }) {
  const serviceId = parseInt(params.id);
  const service = services[serviceId];

  if (!service) {
    notFound();
  }

  const openGrafana = () => {
    window.open(service.grafanaUrl, '_blank');
  };

  const openSentry = () => {
    window.open(`https://sentry.io/projects/${service.sentryProjectId}`, '_blank');
  };

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900">{service.name}</h1>
              <span
                className={classNames(
                  'ml-4 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
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
            <p className="mt-2 text-sm text-gray-700">{service.description}</p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none space-x-4">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={openGrafana}
            >
              <Activity className="mr-2 h-4 w-4" />
              Open in Grafana
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={openSentry}
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              View in Sentry
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Metrics Overview */}
          <div className="rounded-lg bg-white shadow">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Metrics Overview</h3>
              <dl className="mt-4 divide-y divide-gray-200">
                {service.metrics.map((metric) => (
                  <div key={metric.name} className="py-4">
                    <dt className="text-sm font-medium text-gray-500">{metric.name}</dt>
                    <dd className="mt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-semibold text-gray-900">{metric.value}</span>
                        <div className="flex items-center space-x-2">
                          {/* Simple sparkline visualization */}
                          <div className="flex items-end space-x-1 h-8">
                            {metric.history.map((value, i) => (
                              <div
                                key={i}
                                className="w-1 bg-indigo-200 rounded-t"
                                style={{ height: `${(value / Math.max(...metric.history)) * 100}%` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="rounded-lg bg-white shadow">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Recent Alerts</h3>
              <div className="mt-4 flow-root">
                <ul role="list" className="-mb-8">
                  {service.recentAlerts.map((alert, alertIdx) => (
                    <li key={alert.id}>
                      <div className="relative pb-8">
                        {alertIdx !== service.recentAlerts.length - 1 ? (
                          <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span
                              className={classNames(
                                'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white',
                                alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                              )}
                            >
                              {alert.type === 'warning' ? (
                                <AlertTriangle className="h-5 w-5 text-white" />
                              ) : (
                                <Clock className="h-5 w-5 text-white" />
                              )}
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                            <div>
                              <p className="text-sm text-gray-500">{alert.message}</p>
                            </div>
                            <div className="whitespace-nowrap text-right text-sm text-gray-500">
                              {new Date(alert.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sentry Issues */}
          <div className="rounded-lg bg-white shadow lg:col-span-2">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Recent Issues</h3>
              <div className="mt-4">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Issue</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Level</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Count</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Seen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {service.sentryIssues.map((issue) => (
                        <tr key={issue.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                            {issue.message}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span
                              className={classNames(
                                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                issue.level === 'error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                              )}
                            >
                              {issue.level}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{issue.count}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(issue.lastSeen).toLocaleString()}
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
  );
} 