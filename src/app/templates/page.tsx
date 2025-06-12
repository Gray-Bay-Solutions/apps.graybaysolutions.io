'use client';
import { FileCode, Clock, GitBranch, Check, Users, ArrowUpCircle, BarChart3, GitFork, Shield, Server, AlertTriangle, Settings, DollarSign, ExternalLink, PlayCircle, MoreVertical } from 'lucide-react';
import { useState } from 'react';

const templates = [
  {
    id: 1,
    name: 'E-commerce Standard',
    description: 'Standard e-commerce template with cart and checkout',
    version: '2.1.0',
    lastUpdated: '2 days ago',
    status: 'published',
    usageCount: 8,
    activeInstances: 8,
    uptime: '99.9%',
    author: 'Sarah Chen',
    type: 'website',
    repository: 'graybay/ecommerce-standard',
    technologies: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'],
    deploymentTime: '~15 minutes',
    monthlyRevenue: '$24,000',
    securityScore: 'A+',
    lastScan: '1 day ago',
    dependencies: {
      total: 156,
      outdated: 3,
      vulnerable: 0
    },
    recentDeployments: [
      { client: 'Fashion Co', status: 'success', date: '2024-03-15' },
      { client: 'Sports Gear', status: 'success', date: '2024-03-10' }
    ],
    metrics: {
      avgResponseTime: '120ms',
      errorRate: '0.02%',
      dailyTraffic: '25k requests'
    }
  },
  {
    id: 2,
    name: 'Support Chatbot',
    description: 'AI-powered customer support chatbot template',
    version: '1.5.2',
    lastUpdated: '5 days ago',
    status: 'published',
    usageCount: 5,
    activeInstances: 5,
    uptime: '99.95%',
    author: 'Mike Johnson',
    type: 'chatbot',
    repository: 'graybay/support-chatbot',
    technologies: ['OpenAI', 'Node.js', 'WebSocket', 'MongoDB'],
    deploymentTime: '~10 minutes',
    monthlyRevenue: '$15,000',
    securityScore: 'A',
    lastScan: '3 days ago',
    dependencies: {
      total: 89,
      outdated: 5,
      vulnerable: 1
    },
    recentDeployments: [
      { client: 'Tech Solutions', status: 'success', date: '2024-03-12' }
    ],
    metrics: {
      avgResponseTime: '250ms',
      errorRate: '0.1%',
      dailyConversations: '1.2k'
    }
  },
  {
    id: 3,
    name: 'Analytics Dashboard',
    description: 'Real-time analytics dashboard template',
    version: '3.0.1',
    lastUpdated: '1 week ago',
    status: 'published',
    usageCount: 12,
    activeInstances: 11,
    uptime: '99.8%',
    author: 'Alex Wong',
    type: 'dashboard',
    repository: 'graybay/analytics-dashboard',
    technologies: ['React', 'D3.js', 'GraphQL', 'TimescaleDB'],
    deploymentTime: '~20 minutes',
    monthlyRevenue: '$36,000',
    securityScore: 'A+',
    lastScan: '2 days ago',
    dependencies: {
      total: 203,
      outdated: 8,
      vulnerable: 0
    },
    recentDeployments: [
      { client: 'Data Corp', status: 'success', date: '2024-03-14' },
      { client: 'Analytics Pro', status: 'success', date: '2024-03-08' }
    ],
    metrics: {
      avgResponseTime: '180ms',
      errorRate: '0.05%',
      dailyActiveUsers: '5.2k'
    }
  },
  {
    id: 4,
    name: 'API Gateway',
    description: 'Secure API gateway with rate limiting and auth',
    version: '2.3.0',
    lastUpdated: '3 days ago',
    status: 'published',
    usageCount: 15,
    activeInstances: 15,
    uptime: '99.99%',
    author: 'Emma Davis',
    type: 'infrastructure',
    repository: 'graybay/api-gateway',
    technologies: ['Node.js', 'Redis', 'JWT', 'Prometheus'],
    deploymentTime: '~25 minutes',
    monthlyRevenue: '$45,000',
    securityScore: 'A+',
    lastScan: '1 day ago',
    dependencies: {
      total: 112,
      outdated: 2,
      vulnerable: 0
    },
    recentDeployments: [
      { client: 'FinTech Inc', status: 'success', date: '2024-03-13' },
      { client: 'SecureNet', status: 'success', date: '2024-03-11' }
    ],
    metrics: {
      avgResponseTime: '45ms',
      errorRate: '0.01%',
      dailyRequests: '1.2M'
    }
  }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function TemplatesPage() {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const toggleMenu = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Templates</h1>
            <p className="mt-2 text-sm text-gray-700">
              Deploy, manage, and monitor all service templates across client infrastructure.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <BarChart3 className="mr-2 h-4 w-4 text-gray-500" />
              Analytics Report
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <GitFork className="mr-2 h-4 w-4" />
              New Template
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {templates.map((template) => (
            <div
              key={template.id}
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="rounded-lg bg-indigo-50 p-3">
                      <FileCode className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{template.name}</p>
                    <p className="truncate text-sm text-gray-500">{template.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={classNames(
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                      template.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    )}
                  >
                    {template.status === 'published' && <Check className="mr-1 h-3 w-3" />}
                    {template.status}
                  </span>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleMenu(template.id)}
                      className="inline-flex items-center rounded-full p-1.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    {openMenuId === template.id && (
                      <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                        <a
                          href={`/templates/${template.id}`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <ExternalLink className="mr-3 h-4 w-4" />
                          View Details
                        </a>
                        <button
                          type="button"
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <PlayCircle className="mr-3 h-4 w-4" />
                          Deploy Template
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-medium text-gray-500">Technologies</h4>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {template.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-500">Dependencies</h4>
                  <div className="mt-1 text-sm">
                    <span className="text-gray-900">{template.dependencies.total}</span>
                    <span className="text-gray-500"> total, </span>
                    <span className={template.dependencies.vulnerable > 0 ? 'text-red-600' : 'text-gray-900'}>
                      {template.dependencies.vulnerable}
                    </span>
                    <span className="text-gray-500"> vulnerable</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Monthly Revenue</p>
                    <p className="font-medium text-gray-900">{template.monthlyRevenue}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Active Instances</p>
                    <p className="font-medium text-gray-900">{template.activeInstances}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Uptime</p>
                    <p className="font-medium text-gray-900">{template.uptime}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-medium text-gray-500">Recent Deployments</h4>
                    <div className="mt-1 space-y-1">
                      {template.recentDeployments.map((deployment, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <Check className="mr-1.5 h-4 w-4 text-green-500" />
                          <span className="text-gray-900">{deployment.client}</span>
                          <span className="ml-1.5 text-gray-500">{deployment.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-500">Performance</h4>
                    <div className="mt-1 space-y-1 text-sm">
                      <p className="text-gray-600">Response: {template.metrics.avgResponseTime}</p>
                      <p className="text-gray-600">Error Rate: {template.metrics.errorRate}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-500">
                  <GitBranch className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                  v{template.version}
                </div>
                <div className="flex items-center text-gray-500">
                  <Shield className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                  {template.securityScore}
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                  {template.lastUpdated}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 