import { MessageCircle, Clock, User, AlertCircle, CheckCircle, Search, Book, GitPullRequest, Calendar, Settings, ArrowUpCircle } from 'lucide-react';

const changeRequests = [
  {
    id: 1,
    title: 'Add new payment gateway integration',
    client: 'Acme Corp',
    status: 'pending_approval',
    priority: 'high',
    type: 'feature_request',
    createdAt: '30 minutes ago',
    scheduledFor: '2024-03-25',
    impact: 'Payment Processing',
    assignee: 'John Smith',
    services: ['Website', 'API Gateway'],
    description: 'Integration with Stripe for international payments',
  },
  {
    id: 2,
    title: 'Update chatbot response templates',
    client: 'Globex Corporation',
    status: 'scheduled',
    priority: 'medium',
    type: 'configuration',
    createdAt: '2 hours ago',
    scheduledFor: '2024-03-23',
    impact: 'Customer Service',
    assignee: 'Emma Wilson',
    services: ['Chatbot'],
    description: 'New templates for product inquiries',
  },
  {
    id: 3,
    title: 'Custom analytics dashboard',
    client: 'Initech',
    status: 'in_progress',
    priority: 'high',
    type: 'customization',
    createdAt: '1 day ago',
    scheduledFor: '2024-03-22',
    impact: 'Reporting',
    assignee: 'Michael Brown',
    services: ['Analytics'],
    description: 'New dashboard for sales metrics',
  },
  {
    id: 4,
    title: 'SSL Certificate Renewal',
    client: 'Wayne Enterprises',
    status: 'scheduled',
    priority: 'critical',
    type: 'maintenance',
    createdAt: '4 hours ago',
    scheduledFor: '2024-03-24',
    impact: 'Security',
    assignee: 'Sarah Connor',
    services: ['Website'],
    description: 'Annual SSL certificate renewal',
  },
];

const upcomingDeployments = [
  {
    id: 1,
    client: 'Acme Corp',
    type: 'Feature Deployment',
    scheduledFor: '2024-03-25 02:00 AM UTC',
    status: 'scheduled',
    services: ['Website', 'API Gateway'],
    description: 'Payment gateway integration deployment',
  },
  {
    id: 2,
    client: 'Initech',
    type: 'Dashboard Update',
    scheduledFor: '2024-03-22 03:00 AM UTC',
    status: 'pending_approval',
    services: ['Analytics'],
    description: 'Custom analytics dashboard deployment',
  },
];

const changeTypes = [
  { id: 'all', name: 'All Changes' },
  { id: 'feature_request', name: 'Feature Requests' },
  { id: 'configuration', name: 'Configuration Changes' },
  { id: 'maintenance', name: 'Maintenance' },
  { id: 'customization', name: 'Customizations' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function SupportPage() {
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Support</h1>
            <p className="mt-2 text-sm text-gray-700">
              Track and manage client service modifications, feature requests, and deployments.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              New Change Request
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mt-6 space-y-4">
          <div className="flex space-x-4">
            {changeTypes.map((type) => (
              <button
                key={type.id}
                className={classNames(
                  'rounded-md px-3 py-1.5 text-sm font-medium',
                  type.id === 'all' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {type.name}
              </button>
            ))}
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Search change requests..."
            />
          </div>
        </div>

        {/* Upcoming Deployments */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Upcoming Deployments</h2>
          <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Deployment
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Client
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Services
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Scheduled For
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {upcomingDeployments.map((deployment) => (
                  <tr key={deployment.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="flex items-center">
                        <ArrowUpCircle className="mr-2 h-5 w-5 text-indigo-400" />
                        <div>
                          <div className="font-medium text-gray-900">{deployment.type}</div>
                          <div className="text-gray-500">{deployment.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{deployment.client}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {deployment.services.map((service) => (
                          <span
                            key={service}
                            className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {deployment.scheduledFor}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span
                        className={classNames(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                          deployment.status === 'scheduled' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        )}
                      >
                        {deployment.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Change Requests */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Change Requests</h2>
          <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Request
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Client
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Services
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Priority
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Scheduled
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Assignee
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {changeRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="flex items-center">
                        {request.type === 'feature_request' && <GitPullRequest className="mr-2 h-5 w-5 text-purple-400" />}
                        {request.type === 'configuration' && <Settings className="mr-2 h-5 w-5 text-blue-400" />}
                        {request.type === 'maintenance' && <Clock className="mr-2 h-5 w-5 text-gray-400" />}
                        {request.type === 'customization' && <MessageCircle className="mr-2 h-5 w-5 text-green-400" />}
                        <div>
                          <div className="font-medium text-gray-900">{request.title}</div>
                          <div className="text-gray-500">{request.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{request.client}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {request.services.map((service) => (
                          <span
                            key={service}
                            className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span
                        className={classNames(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                          request.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          request.status === 'in_progress' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-green-100 text-green-800'
                        )}
                      >
                        {request.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span
                        className={classNames(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                          request.priority === 'critical' ? 'bg-red-100 text-red-800' :
                          request.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        )}
                      >
                        {request.priority}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                        {request.scheduledFor}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="mr-1.5 h-4 w-4 text-gray-400" />
                        {request.assignee}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 