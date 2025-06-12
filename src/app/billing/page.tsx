import { CreditCard, DollarSign, TrendingUp, Users, ArrowUpCircle, ArrowDownCircle, Clock, FileText, Cloud, Database, Shield, Server } from 'lucide-react';

const revenueStats = [
  { 
    name: 'Monthly Revenue', 
    value: '$45,850', 
    change: '+12.3%',
    trend: 'up',
    details: 'vs last month',
    icon: DollarSign 
  },
  { 
    name: 'Active Subscriptions', 
    value: '24', 
    change: '+2.4%',
    trend: 'up',
    details: '2 new this month',
    icon: Users 
  },
  { 
    name: 'Average Revenue/Client', 
    value: '$1,910', 
    change: '+4.1%',
    trend: 'up',
    details: '$80 increase',
    icon: TrendingUp 
  },
  { 
    name: 'Payment Success Rate', 
    value: '99.8%', 
    change: '+0.2%',
    trend: 'up',
    details: '2 failed payments',
    icon: CreditCard 
  },
];

const expenseStats = [
  {
    name: 'Cloud Infrastructure',
    value: '$12,450',
    change: '+8.2%',
    trend: 'up',
    details: 'AWS + GCP',
    icon: Cloud
  },
  {
    name: 'Database Services',
    value: '$5,280',
    change: '-2.1%',
    trend: 'down',
    details: 'Optimization gains',
    icon: Database
  },
  {
    name: 'Security Services',
    value: '$3,900',
    change: '+15.3%',
    trend: 'up',
    details: 'New compliance tools',
    icon: Shield
  },
  {
    name: 'Third-party APIs',
    value: '$2,800',
    change: 'No change',
    trend: 'neutral',
    details: '4 active services',
    icon: Server
  },
];

const recentInvoices = [
  {
    id: 1,
    client: 'Acme Corp',
    amount: '$2,500',
    status: 'Paid',
    date: 'July 1, 2023',
    dueDate: 'July 15, 2023',
    type: 'Monthly Subscription',
    services: ['Website Hosting', 'API Gateway', 'Analytics'],
    paymentMethod: 'Credit Card',
  },
  {
    id: 2,
    client: 'Globex Corporation',
    amount: '$1,800',
    status: 'Pending',
    date: 'July 1, 2023',
    dueDate: 'July 15, 2023',
    type: 'Monthly Subscription',
    services: ['Chatbot', 'Analytics'],
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 3,
    client: 'Initech',
    amount: '$950',
    status: 'Overdue',
    date: 'June 15, 2023',
    dueDate: 'June 30, 2023',
    type: 'Monthly Subscription',
    services: ['Website Hosting'],
    paymentMethod: 'Credit Card',
  },
];

const monthlyExpenses = [
  {
    id: 1,
    vendor: 'Amazon Web Services',
    amount: '$8,250',
    category: 'Cloud Infrastructure',
    status: 'Paid',
    date: 'July 1, 2023',
    details: 'EC2, RDS, S3 Services',
  },
  {
    id: 2,
    vendor: 'Google Cloud Platform',
    amount: '$4,200',
    category: 'Cloud Infrastructure',
    status: 'Pending',
    date: 'July 1, 2023',
    details: 'Compute Engine, BigQuery',
  },
  {
    id: 3,
    vendor: 'MongoDB Atlas',
    amount: '$2,800',
    category: 'Database Services',
    status: 'Paid',
    date: 'July 1, 2023',
    details: 'Dedicated Cluster',
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function BillingPage() {
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Billing</h1>
            <p className="mt-2 text-sm text-gray-700">
              Comprehensive view of revenue, expenses, and billing status.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <FileText className="mr-2 h-4 w-4 text-gray-500" />
              Download Reports
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Generate Invoice
            </button>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Revenue Overview</h2>
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {revenueStats.map((item) => (
              <div
                key={item.name}
                className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
              >
                <dt>
                  <div className="absolute rounded-md bg-indigo-500 p-3">
                    <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
                </dt>
                <dd className="ml-16 flex flex-col pb-6 sm:pb-7">
                  <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                  <div className="flex items-baseline text-sm">
                    <p className={classNames(
                      'font-semibold',
                      item.trend === 'up' ? 'text-green-600' : 
                      item.trend === 'down' ? 'text-red-600' : 
                      'text-gray-500'
                    )}>
                      {item.change}
                    </p>
                    <p className="ml-2 text-gray-500">{item.details}</p>
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Expense Stats */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Expense Overview</h2>
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {expenseStats.map((item) => (
              <div
                key={item.name}
                className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
              >
                <dt>
                  <div className="absolute rounded-md bg-gray-500 p-3">
                    <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
                </dt>
                <dd className="ml-16 flex flex-col pb-6 sm:pb-7">
                  <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                  <div className="flex items-baseline text-sm">
                    <p className={classNames(
                      'font-semibold',
                      item.trend === 'up' ? 'text-red-600' : 
                      item.trend === 'down' ? 'text-green-600' : 
                      'text-gray-500'
                    )}>
                      {item.change}
                    </p>
                    <p className="ml-2 text-gray-500">{item.details}</p>
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Monthly Expenses */}
        <div className="mt-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-lg font-medium text-gray-900">Monthly Expenses</h2>
              <p className="mt-2 text-sm text-gray-700">
                Breakdown of current month's operational expenses and services.
              </p>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Vendor
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Category
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Amount
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {monthlyExpenses.map((expense) => (
                        <tr key={expense.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {expense.vendor}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {expense.category}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {expense.amount}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span
                              className={classNames(
                                'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                                expense.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                'bg-yellow-100 text-yellow-800'
                              )}
                            >
                              {expense.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {expense.details}
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

        {/* Client Invoices */}
        <div className="mt-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-lg font-medium text-gray-900">Client Invoices</h2>
              <p className="mt-2 text-sm text-gray-700">
                Recent invoices and payment status for client services.
              </p>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Client
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Type
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Services
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Amount
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Due Date
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Payment Method
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {recentInvoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {invoice.client}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {invoice.type}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="flex flex-wrap gap-1">
                              {invoice.services.map((service) => (
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
                            {invoice.amount}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span
                              className={classNames(
                                'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                                invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              )}
                            >
                              {invoice.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {invoice.dueDate}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {invoice.paymentMethod}
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