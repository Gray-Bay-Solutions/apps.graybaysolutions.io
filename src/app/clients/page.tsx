'use client';

import { CheckCircle, XCircle, BarChart3, DollarSign, Users, Clock, Shield, Server, ArrowUpCircle, AlertTriangle, Settings, ExternalLink, MoreVertical } from 'lucide-react';
import { useState } from 'react';

const clients = [
  {
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
      { date: '2024-03-15', status: 'success', type: 'Website Update' },
      { date: '2024-03-10', status: 'success', type: 'Chatbot Deployment' }
    ],
    costs: {
      infrastructure: '$2,800',
      services: '$1,500',
      total: '$4,300'
    },
    metrics: {
      apiCalls: '2.5M/month',
      dataProcessed: '500GB',
      storageUsed: '250GB'
    }
  },
  {
    id: 2,
    name: 'Globex Corporation',
    website: 'globex-corp.com',
    status: 'active',
    services: ['Website', 'Dashboard'],
    lastDeployed: '1 day ago',
    healthScore: 95,
    monthlyRevenue: '$18,000',
    activeUsers: '22k',
    uptime: '99.95%',
    responseTime: '145ms',
    errorRate: '0.05%',
    securityScore: 'A',
    deployments: [
      { date: '2024-03-14', status: 'success', type: 'Dashboard Update' }
    ],
    costs: {
      infrastructure: '$3,200',
      services: '$2,000',
      total: '$5,200'
    },
    metrics: {
      apiCalls: '3.2M/month',
      dataProcessed: '750GB',
      storageUsed: '400GB'
    }
  },
  {
    id: 3,
    name: 'Initech',
    website: 'initech.com',
    status: 'inactive',
    services: ['Website'],
    lastDeployed: '5 days ago',
    healthScore: 72,
    monthlyRevenue: '$5,000',
    activeUsers: '8k',
    uptime: '98.5%',
    responseTime: '280ms',
    errorRate: '1.2%',
    securityScore: 'B',
    deployments: [
      { date: '2024-03-10', status: 'failed', type: 'Website Deployment' }
    ],
    costs: {
      infrastructure: '$1,500',
      services: '$800',
      total: '$2,300'
    },
    metrics: {
      apiCalls: '800k/month',
      dataProcessed: '200GB',
      storageUsed: '150GB'
    }
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ClientsPage() {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const toggleMenu = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const totalRevenue = clients.reduce((sum, client) => {
    const revenue = parseFloat(client.monthlyRevenue.replace(/[$,]/g, ''));
    return sum + revenue;
  }, 0);

  const totalCosts = clients.reduce((sum, client) => {
    return sum + parseFloat(client.costs.total.replace(/[$,]/g, ''));
  }, 0);

  const averageHealthScore = clients.reduce((sum, client) => sum + client.healthScore, 0) / clients.length;

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
            <p className="mt-2 text-sm text-gray-700">
              Comprehensive overview of all client deployments, performance metrics, and business impact.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <BarChart3 className="mr-2 h-4 w-4 text-gray-500" />
              Portfolio Report
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <Users className="mr-2 h-4 w-4" />
              New Client
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white shadow p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Monthly Revenue</dt>
                  <dd className="text-lg font-semibold text-gray-900">${totalRevenue.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white shadow p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Server className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Infrastructure Costs</dt>
                  <dd className="text-lg font-semibold text-gray-900">${totalCosts.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white shadow p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowUpCircle className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Average Health Score</dt>
                  <dd className="text-lg font-semibold text-gray-900">{averageHealthScore.toFixed(1)}%</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white shadow p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Alerts</dt>
                  <dd className="text-lg font-semibold text-gray-900">2</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Client Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {clients.map((client) => (
            <div
              key={client.id}
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="rounded-lg bg-gray-50 p-3">
                      <Users className="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-500">{client.website}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={classNames(
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                      client.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    )}
                  >
                    {client.status === 'active' ? (
                      <CheckCircle className="mr-1 h-3 w-3" />
                    ) : (
                      <XCircle className="mr-1 h-3 w-3" />
                    )}
                    {client.status}
                  </span>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleMenu(client.id)}
                      className="inline-flex items-center rounded-full p-1.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    {openMenuId === client.id && (
                      <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                        <a
                          href={`/clients/${client.id}`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <ExternalLink className="mr-3 h-4 w-4" />
                          View Details
                        </a>
                        <button
                          type="button"
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Settings className="mr-3 h-4 w-4" />
                          Manage Services
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-medium text-gray-500">Active Services</h4>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {client.services.map((service) => (
                      <span
                        key={service}
                        className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-500">Monthly Revenue</h4>
                  <p className="mt-1 text-sm font-medium text-gray-900">{client.monthlyRevenue}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 border-t border-gray-200 pt-4">
                <div>
                  <p className="text-xs text-gray-500">Response Time</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{client.responseTime}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Error Rate</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{client.errorRate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Uptime</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{client.uptime}</p>
                </div>
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">Security Score:</span>
                    <span className="ml-1 text-sm font-medium text-gray-900">{client.securityScore}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">Last Deploy:</span>
                    <span className="ml-1 text-sm font-medium text-gray-900">{client.lastDeployed}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 