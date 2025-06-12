import { 
  FileCode, Clock, GitBranch, Check, Users, ArrowUpCircle, 
  BarChart3, GitFork, Shield, Server, AlertTriangle, Settings,
  DollarSign, Terminal, Globe, Database, Activity, Code, Link,
  ExternalLink, PlayCircle, PauseCircle, RefreshCw, Book
} from 'lucide-react';

// This would normally come from an API or database
const templateDetail = {
  id: 1,
  name: 'E-commerce Standard',
  description: 'Standard e-commerce template with cart and checkout functionality. Includes product management, inventory tracking, and payment processing.',
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
    vulnerable: 0,
    critical: ['stripe-js', 'next-auth', 'postgresql-client'],
    recent: ['@types/react@18.2.0', 'tailwindcss@3.4.0']
  },
  recentDeployments: [
    { 
      client: 'Fashion Co', 
      status: 'success', 
      date: '2024-03-15',
      environment: 'production',
      version: '2.1.0',
      deployedBy: 'Sarah Chen',
      duration: '12 minutes'
    },
    { 
      client: 'Sports Gear', 
      status: 'success', 
      date: '2024-03-10',
      environment: 'production',
      version: '2.1.0',
      deployedBy: 'Mike Johnson',
      duration: '14 minutes'
    }
  ],
  metrics: {
    avgResponseTime: '120ms',
    errorRate: '0.02%',
    dailyTraffic: '25k requests',
    peakLoad: '2.3k req/min',
    avgServerLoad: '45%',
    avgMemoryUsage: '2.1GB',
    dataTransfer: '450GB/month'
  },
  environments: [
    {
      name: 'Production',
      status: 'healthy',
      url: 'https://fashion-co.example.com',
      lastDeployed: '2024-03-15',
      version: '2.1.0',
      region: 'us-east-1'
    },
    {
      name: 'Staging',
      status: 'healthy',
      url: 'https://staging.fashion-co.example.com',
      lastDeployed: '2024-03-14',
      version: '2.1.1-beta',
      region: 'us-east-1'
    }
  ],
  documentation: {
    setup: 'https://docs.example.com/ecommerce/setup',
    api: 'https://docs.example.com/ecommerce/api',
    deployment: 'https://docs.example.com/ecommerce/deployment'
  },
  features: [
    'Product catalog with categories and search',
    'Shopping cart and checkout process',
    'Payment processing with Stripe',
    'Order management and tracking',
    'Inventory management',
    'Customer accounts and profiles',
    'Admin dashboard',
    'Analytics and reporting'
  ],
  requirements: {
    cpu: '2 vCPUs',
    memory: '4GB RAM',
    storage: '20GB SSD',
    database: 'PostgreSQL 14+',
    node: '18.x',
    services: ['Redis', 'S3']
  },
  costs: {
    base: '$199/month',
    perUser: '$2/user/month',
    storage: '$0.05/GB/month',
    bandwidth: '$0.10/GB'
  },
  updates: [
    {
      version: '2.1.0',
      date: '2024-03-01',
      type: 'major',
      changes: [
        'Added support for multiple payment providers',
        'Improved search performance',
        'Updated dependencies'
      ]
    },
    {
      version: '2.0.1',
      date: '2024-02-15',
      type: 'patch',
      changes: [
        'Fixed cart calculation bug',
        'Security updates'
      ]
    }
  ]
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function TemplateDetailPage() {
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center">
              <div className="rounded-lg bg-indigo-50 p-3">
                <FileCode className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                  {templateDetail.name}
                </h2>
                <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <GitBranch className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    v{templateDetail.version}
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Users className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    {templateDetail.activeInstances} active instances
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Clock className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    Last updated {templateDetail.lastUpdated}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex space-x-3 md:ml-4 md:mt-0">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <Terminal className="mr-2 h-4 w-4 text-gray-500" />
              Clone Repository
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Deploy Template
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
                <p className="text-xl font-semibold text-gray-900">{templateDetail.monthlyRevenue}</p>
                <p className="text-sm text-gray-500">From {templateDetail.activeInstances} clients</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Uptime</p>
                <p className="text-xl font-semibold text-gray-900">{templateDetail.uptime}</p>
                <p className="text-sm text-gray-500">Last 30 days</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Security Score</p>
                <p className="text-xl font-semibold text-gray-900">{templateDetail.securityScore}</p>
                <p className="text-sm text-gray-500">Last scan {templateDetail.lastScan}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Daily Traffic</p>
                <p className="text-xl font-semibold text-gray-900">{templateDetail.metrics.dailyTraffic}</p>
                <p className="text-sm text-gray-500">Peak: {templateDetail.metrics.peakLoad}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Description and Features */}
            <div className="rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">About this Template</h3>
                <p className="mt-4 text-gray-500">{templateDetail.description}</p>
                
                <h4 className="mt-6 text-sm font-medium text-gray-900">Key Features</h4>
                <ul className="mt-4 grid grid-cols-1 gap-4">
                  {templateDetail.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Technical Requirements */}
            <div className="rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Technical Requirements</h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Infrastructure</h4>
                    <ul className="mt-2 space-y-2">
                      <li className="text-sm text-gray-600">CPU: {templateDetail.requirements.cpu}</li>
                      <li className="text-sm text-gray-600">Memory: {templateDetail.requirements.memory}</li>
                      <li className="text-sm text-gray-600">Storage: {templateDetail.requirements.storage}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Dependencies</h4>
                    <ul className="mt-2 space-y-2">
                      <li className="text-sm text-gray-600">Node.js: {templateDetail.requirements.node}</li>
                      <li className="text-sm text-gray-600">Database: {templateDetail.requirements.database}</li>
                      {templateDetail.requirements.services.map((service, idx) => (
                        <li key={idx} className="text-sm text-gray-600">{service}</li>
                      ))}
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
                  {templateDetail.recentDeployments.map((deployment, idx) => (
                    <div key={idx} className="rounded-lg bg-gray-50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-green-500" />
                          <span className="ml-2 text-sm font-medium text-gray-900">{deployment.client}</span>
                        </div>
                        <span className="text-sm text-gray-500">{deployment.date}</span>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-500">
                        <div>Environment: {deployment.environment}</div>
                        <div>Version: {deployment.version}</div>
                        <div>Duration: {deployment.duration}</div>
                        <div>By: {deployment.deployedBy}</div>
                      </div>
                    </div>
                  ))}
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
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{templateDetail.metrics.avgResponseTime}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Error Rate</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{templateDetail.metrics.errorRate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Server Load</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{templateDetail.metrics.avgServerLoad}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Memory Usage</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{templateDetail.metrics.avgMemoryUsage}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Environments */}
            <div className="rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Active Environments</h3>
                <div className="mt-4 space-y-4">
                  {templateDetail.environments.map((env, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                      <div>
                        <div className="flex items-center">
                          {env.status === 'healthy' ? (
                            <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400" />
                          ) : (
                            <div className="mr-2 h-2.5 w-2.5 rounded-full bg-red-400" />
                          )}
                          <span className="font-medium text-gray-900">{env.name}</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          <span className="mr-2">v{env.version}</span>
                          <span className="mr-2">•</span>
                          <span>{env.region}</span>
                        </div>
                      </div>
                      <a
                        href={env.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                      >
                        View <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Documentation Links */}
            <div className="rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Documentation</h3>
                <div className="mt-4 space-y-3">
                  {Object.entries(templateDetail.documentation).map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center rounded-md bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100"
                    >
                      <Book className="mr-2 h-5 w-5 text-gray-400" />
                      {key.charAt(0).toUpperCase() + key.slice(1)} Guide
                      <ExternalLink className="ml-auto h-4 w-4 text-gray-400" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Update History */}
            <div className="rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Update History</h3>
                <div className="mt-4 space-y-4">
                  {templateDetail.updates.map((update, idx) => (
                    <div key={idx} className="rounded-lg bg-gray-50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">v{update.version}</span>
                          <span className={classNames(
                            'ml-2 rounded-full px-2 py-0.5 text-xs font-medium',
                            update.type === 'major' ? 'bg-blue-100 text-blue-800' :
                            update.type === 'minor' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          )}>
                            {update.type}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">{update.date}</span>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {update.changes.map((change, changeIdx) => (
                          <li key={changeIdx} className="flex items-start text-sm text-gray-600">
                            <span className="mr-2">•</span>
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 