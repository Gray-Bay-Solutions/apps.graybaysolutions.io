import { 
  Upload, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  Server, 
  FileCode,
  CreditCard
} from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'deployment',
    description: 'Website deployment completed successfully',
    user: 'Sarah Chen',
    target: 'Acme Corp Website',
    timestamp: '5 minutes ago',
    status: 'success',
    icon: Upload,
  },
  {
    id: 2,
    type: 'configuration',
    description: 'System settings updated',
    user: 'Admin',
    target: 'Global Configuration',
    timestamp: '1 hour ago',
    status: 'success',
    icon: Settings,
  },
  {
    id: 3,
    type: 'alert',
    description: 'High CPU usage detected',
    user: 'System',
    target: 'Server cluster-01',
    timestamp: '2 hours ago',
    status: 'warning',
    icon: AlertTriangle,
  },
  {
    id: 4,
    type: 'client',
    description: 'New client onboarded',
    user: 'Emma Wilson',
    target: 'TechCorp Inc.',
    timestamp: '1 day ago',
    status: 'success',
    icon: User,
  },
  {
    id: 5,
    type: 'service',
    description: 'New service instance created',
    user: 'John Smith',
    target: 'Analytics Dashboard',
    timestamp: '1 day ago',
    status: 'success',
    icon: Server,
  },
  {
    id: 6,
    type: 'template',
    description: 'Template version updated',
    user: 'Mike Johnson',
    target: 'E-commerce Standard Template',
    timestamp: '2 days ago',
    status: 'success',
    icon: FileCode,
  },
  {
    id: 7,
    type: 'billing',
    description: 'Monthly invoice generated',
    user: 'System',
    target: 'All active clients',
    timestamp: '3 days ago',
    status: 'success',
    icon: CreditCard,
  },
];

const activityTypeFilters = [
  { value: 'all', label: 'All' },
  { value: 'deployment', label: 'Deployments' },
  { value: 'configuration', label: 'Configuration' },
  { value: 'alert', label: 'Alerts' },
  { value: 'client', label: 'Clients' },
  { value: 'service', label: 'Services' },
  { value: 'template', label: 'Templates' },
  { value: 'billing', label: 'Billing' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ActivityPage() {
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Activity</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all activities and system events across the platform.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <select
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              defaultValue="all"
            >
              {activityTypeFilters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <div className="overflow-hidden bg-white shadow sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {activities.map((activity) => (
                <li key={activity.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={classNames(
                          'rounded-md p-2',
                          activity.status === 'success' ? 'bg-green-50' : 'bg-yellow-50'
                        )}>
                          <activity.icon 
                            className={classNames(
                              'h-5 w-5',
                              activity.status === 'success' ? 'text-green-500' : 'text-yellow-500'
                            )}
                          />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-500">
                              by {activity.user}
                            </p>
                            <span className="text-gray-500">•</span>
                            <p className="text-sm text-gray-500">
                              {activity.target}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-6 flex flex-shrink-0">
                        <p className="text-sm text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-center">
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <a
                href="#"
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                Previous
              </a>
              <a
                href="#"
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                1
              </a>
              <a
                href="#"
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                2
              </a>
              <a
                href="#"
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                3
              </a>
              <a
                href="#"
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                Next
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
} 