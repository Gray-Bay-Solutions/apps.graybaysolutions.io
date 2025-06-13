'use client';

import { CheckCircle, XCircle, BarChart3, DollarSign, Users, Clock, Shield, Server, ArrowUpCircle, AlertTriangle, Settings, ExternalLink, MoreVertical, Search, Filter, Eye, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [healthFilter, setHealthFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  useEffect(() => {
    async function fetchClients() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/clients');
        if (!res.ok) throw new Error('Failed to fetch clients');
        const data = await res.json();
        setClients(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
  }, []);

  const toggleMenu = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Filter and sort clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.website?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesHealth = healthFilter === 'all' || 
                         (healthFilter === 'healthy' && (client.healthScore || 0) >= 80) ||
                         (healthFilter === 'warning' && (client.healthScore || 0) >= 60 && (client.healthScore || 0) < 80) ||
                         (healthFilter === 'critical' && (client.healthScore || 0) < 60);
    
    return matchesSearch && matchesStatus && matchesHealth;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'health':
        return (b.healthScore || 0) - (a.healthScore || 0);
      case 'revenue':
        return (b.monthlyRevenue || 0) - (a.monthlyRevenue || 0);
      case 'services':
        return (b.services?.length || 0) - (a.services?.length || 0);
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const totalRevenue = clients.reduce((sum, client) => sum + (client.monthlyRevenue || 0), 0);
  const totalCosts = clients.reduce((sum, client) => sum + (client.costs?.total || 0), 0);
  const averageHealthScore = clients.length > 0 ? (clients.reduce((sum, client) => sum + (client.healthScore || 0), 0) / clients.length) : 0;
  
  // Health status counts
  const healthyClients = clients.filter(c => (c.healthScore || 0) >= 80).length;
  const warningClients = clients.filter(c => (c.healthScore || 0) >= 60 && (c.healthScore || 0) < 80).length;
  const criticalClients = clients.filter(c => (c.healthScore || 0) < 60).length;
  const activeClients = clients.filter(c => c.status === 'active').length;

  const getHealthColor = (healthScore: number) => {
    if (healthScore >= 80) return 'text-green-600 bg-green-100';
    if (healthScore >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getHealthIcon = (healthScore: number) => {
    if (healthScore >= 80) return CheckCircle;
    if (healthScore >= 60) return AlertTriangle;
    return XCircle;
  };

  const getTrendIcon = (value: number, previous: number = 0) => {
    if (value > previous) return TrendingUp;
    if (value < previous) return TrendingDown;
    return Minus;
  };

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb
            items={[
              { label: 'Clients' }
            ]}
          />
        </div>

        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Client Portfolio</h1>
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
            <Link
              href="/clients/new"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <Users className="mr-2 h-4 w-4" />
              New Client
            </Link>
          </div>
        </div>

        {/* Enhanced Summary Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg bg-white shadow p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {activeClients} active
                </p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg bg-white shadow p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Net: ${(totalRevenue - totalCosts).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white shadow p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Healthy</p>
                <p className="text-2xl font-bold text-gray-900">{healthyClients}</p>
                <p className="text-sm text-gray-500">{((healthyClients / clients.length) * 100 || 0).toFixed(0)}% of portfolio</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white shadow p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Warning</p>
                <p className="text-2xl font-bold text-gray-900">{warningClients}</p>
                <p className="text-sm text-gray-500">Need attention</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white shadow p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Critical</p>
                <p className="text-2xl font-bold text-gray-900">{criticalClients}</p>
                <p className="text-sm text-red-600">Immediate action</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={healthFilter}
                onChange={(e) => setHealthFilter(e.target.value)}
                className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="all">All Health</option>
                <option value="healthy">Healthy (80%+)</option>
                <option value="warning">Warning (60-79%)</option>
                <option value="critical">Critical (&lt;60%)</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="name">Sort by Name</option>
                <option value="health">Sort by Health</option>
                <option value="revenue">Sort by Revenue</option>
                <option value="services">Sort by Services</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {filteredClients.length} of {clients.length} clients
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">View:</span>
              <button
                onClick={() => setViewMode('cards')}
                className={classNames(
                  'px-3 py-1 rounded-md text-sm font-medium',
                  viewMode === 'cards' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'
                )}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={classNames(
                  'px-3 py-1 rounded-md text-sm font-medium',
                  viewMode === 'table' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'
                )}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Loading/Error States */}
        {loading && <div className="mt-8 text-center text-gray-500">Loading clients...</div>}
        {error && <div className="mt-8 text-center text-red-500">{error}</div>}

        {/* Client Cards/Table */}
        {!loading && !error && (
          <div className="mt-8">
            {filteredClients.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : viewMode === 'cards' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredClients.map((client) => {
                  const healthScore = client.healthScore || 0;
                  const HealthIcon = getHealthIcon(healthScore);
                  
                  return (
                    <div
                      key={client.id}
                      className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      {/* Health Status Indicator */}
                      <div className="absolute top-4 right-4">
                        <span
                          className={classNames(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            getHealthColor(healthScore)
                          )}
                        >
                          <HealthIcon className="mr-1 h-3 w-3" />
                          {healthScore}%
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="rounded-lg bg-gray-50 p-3">
                            <Users className="h-6 w-6 text-gray-600" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link href={`/clients/${client.id}`} className="focus:outline-none">
                            <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600">
                              {client.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-500">{client.website}</p>
                          <div className="mt-1 flex items-center space-x-2">
                            <span
                              className={classNames(
                                'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                                client.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              )}
                            >
                              {client.status}
                            </span>
                            {client.services && (
                              <span className="text-xs text-gray-500">
                                {client.services.length} services
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Key Metrics */}
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Monthly Revenue</p>
                          <p className="text-lg font-semibold text-gray-900">
                            ${(client.monthlyRevenue || 0).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Response Time</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {client.responseTime || '-'}
                          </p>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-200">
                        <Link
                          href={`/clients/${client.id}`}
                          className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          View Details
                        </Link>
                        <Link
                          href={`/clients/${client.id}?tab=services`}
                          className="text-sm text-gray-600 hover:text-gray-900"
                        >
                          Manage Services
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Table View
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Health
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Services
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClients.map((client) => {
                      const healthScore = client.healthScore || 0;
                      const HealthIcon = getHealthIcon(healthScore);
                      
                      return (
                        <tr key={client.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                  <Users className="h-5 w-5 text-gray-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{client.name}</div>
                                <div className="text-sm text-gray-500">{client.website}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={classNames(
                                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                getHealthColor(healthScore)
                              )}
                            >
                              <HealthIcon className="mr-1 h-3 w-3" />
                              {healthScore}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {client.services?.length || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${(client.monthlyRevenue || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {client.responseTime || '-'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {client.uptime || '-'} uptime
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Link
                                href={`/clients/${client.id}`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <Link
                                href={`/clients/${client.id}?tab=services`}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <Settings className="h-4 w-4" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 