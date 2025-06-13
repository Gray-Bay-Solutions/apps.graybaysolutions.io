import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Users,
  Server,
  Shield,
  CircleDollarSign
} from "lucide-react";
import Link from "next/link";

const financialMetrics = {
  revenue: {
    current: '$142.8k',
    trend: '+12.3%',
    vsLastMonth: '+$15.6k',
    isPositive: true
  },
  costs: {
    current: '$48.2k',
    trend: '+2.1%',
    vsLastMonth: '+$1.2k',
    isPositive: false
  },
  margin: {
    current: '66.2%',
    trend: '+4.2%',
    vsLastMonth: '+2.8%',
    isPositive: true
  }
};

const systemMetrics = [
  { 
    name: 'System Health',
    value: '98%',
    trend: '+2%',
    details: '3 minor incidents',
    status: 'success',
    icon: Server
  },
  { 
    name: 'Active Users',
    value: '2,847',
    trend: '+12%',
    details: '245 new this week',
    status: 'success',
    icon: Users
  },
  { 
    name: 'Security Score',
    value: 'A+',
    trend: 'stable',
    details: '0 critical issues',
    status: 'success',
    icon: Shield
  },
  { 
    name: 'Cost per User',
    value: '$16.93',
    trend: '-5%',
    details: 'Below target: $20',
    status: 'success',
    icon: CircleDollarSign
  },
];

const recentActivity = [
  {
    id: 1,
    name: 'New Enterprise Client',
    description: 'Acme Corp signed annual contract',
    date: '2h ago',
    value: '+$24k MRR',
    status: 'success',
    type: 'business'
  },
  {
    id: 2,
    name: 'API Performance',
    description: 'Response time improved by 35%',
    date: '3h ago',
    value: '89ms avg',
    status: 'success',
    type: 'technical'
  },
  {
    id: 3,
    name: 'Security Alert',
    description: 'Blocked suspicious login attempts',
    date: '5h ago',
    value: '23 attempts',
    status: 'warning',
    type: 'security'
  },
  {
    id: 4,
    name: 'Infrastructure Cost',
    description: 'Optimized cloud resources',
    date: '1 day ago',
    value: '-$2.3k/mo',
    status: 'success',
    type: 'cost'
  },
];

const upcomingActions = [
  {
    id: 1,
    name: 'Security Audit',
    dueDate: 'Tomorrow',
    priority: 'high',
    type: 'security'
  },
  {
    id: 2,
    name: 'Client QBR',
    dueDate: 'This week',
    priority: 'medium',
    type: 'business'
  },
  {
    id: 3,
    name: 'System Upgrade',
    dueDate: 'Next week',
    priority: 'medium',
    type: 'technical'
  }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Financial Overview */}
      <div>
        {/* <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">Financial Overview</h2> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(financialMetrics).map(([key, metric]) => (
            <div key={key} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 capitalize">{key}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{metric.current}</p>
                </div>
                <div className={classNames(
                  metric.isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700',
                  'rounded-full p-2'
                )}>
                  {metric.isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                </div>
              </div>
              <div className="mt-4">
                <span className={classNames(
                  metric.isPositive ? 'text-green-700' : 'text-red-700',
                  'text-sm font-medium'
                )}>
                  {metric.trend}
                </span>
                <span className="text-gray-500 text-sm ml-2">vs last month ({metric.vsLastMonth})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Metrics */}
      <div>
        <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.name}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center">
                  <div className={classNames(
                    metric.status === 'success' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700',
                    'rounded-full p-3'
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{metric.name}</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{metric.value}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <span className={metric.trend.includes('+') ? 'text-green-600' : metric.trend.includes('-') ? 'text-red-600' : 'text-gray-600'}>
                    {metric.trend}
                  </span>
                  <span className="mx-1">•</span>
                  {metric.details}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            </div>
            <ul role="list" className="divide-y divide-gray-200">
              {recentActivity.map((item) => (
                <li key={item.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                      <div className={classNames(
                        item.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700',
                        'flex-shrink-0 rounded-full p-2'
                      )}>
                        {item.status === 'success' ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <AlertTriangle className="h-5 w-5" />
                        )}
                      </div>
                      <div className="ml-4 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-sm text-gray-500 truncate">{item.description}</p>
                      </div>
                    </div>
                    <div className="ml-6 flex flex-col items-end">
                      <p className={classNames(
                        'text-sm font-medium',
                        item.value.includes('+') ? 'text-green-600' : item.value.includes('-') ? 'text-red-600' : 'text-gray-900'
                      )}>{item.value}</p>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Items */}
        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Action Items</h2>
            </div>
            <ul role="list" className="divide-y divide-gray-200">
              {upcomingActions.map((action) => (
                <li key={action.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{action.name}</p>
                      <p className="text-sm text-gray-500">Due: {action.dueDate}</p>
                    </div>
                    <span className={classNames(
                      'px-2.5 py-1 rounded-full text-xs font-medium',
                      action.priority === 'high' ? 'bg-red-100 text-red-800' :
                      action.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    )}>
                      {action.priority}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-6 border-t border-gray-200">
              <Link
                href="/tasks"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all tasks
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 