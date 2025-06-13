'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Settings, 
  Trash2, 
  Edit3, 
  Globe, 
  MessageSquare, 
  BarChart3, 
  Database, 
  Shield, 
  Server,
  CheckCircle,
  AlertTriangle,
  XCircle,
  DollarSign,
  Activity,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface Service {
  id: number;
  name: string;
  type: string;
  description?: string;
  status: string;
  healthScore: number;
  costPerUnit?: number;
  customPrice?: number;
  capacityLimit?: number;
  currentUsage?: number;
  createdAt: string;
  updatedAt: string;
  metrics?: Array<{
    id: number;
    name: string;
    value: string;
    unit?: string;
    timestamp: string;
  }>;
  resourceAllocations?: Array<{
    id: number;
    allocated: number;
    used: number;
    cost: number;
    timestamp: string;
  }>;
}

interface ServiceManagementProps {
  clientId: number;
  clientName: string;
}

const serviceIcons: Record<string, any> = {
  website: Globe,
  chatbot: MessageSquare,
  analytics: BarChart3,
  database: Database,
  security: Shield,
  api: Server,
  default: Server,
};

const serviceTypes = [
  { id: 'website', name: 'Website', description: 'Website hosting and management' },
  { id: 'chatbot', name: 'AI Chatbot', description: 'AI-powered customer service chatbot' },
  { id: 'analytics', name: 'Analytics', description: 'Real-time analytics dashboard' },
  { id: 'database', name: 'Database', description: 'Database hosting and management' },
  { id: 'security', name: 'Security', description: 'Security and authentication services' },
  { id: 'api', name: 'API Gateway', description: 'API management and routing' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ServiceManagement({ clientId, clientName }: ServiceManagementProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'website',
    description: '',
    costPerUnit: 0,
    customPrice: 0,
    capacityLimit: 100,
    healthEndpoint: '',
  });

  useEffect(() => {
    fetchServices();
  }, [clientId]);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/clients/${clientId}/services`);
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const method = editingService ? 'PUT' : 'POST';
      const url = editingService 
        ? `/api/clients/${clientId}/services/${editingService.id}`
        : `/api/clients/${clientId}/services`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save service');

      await fetchServices();
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      type: service.type,
      description: service.description || '',
      costPerUnit: service.costPerUnit || 0,
      customPrice: service.customPrice || 0,
      capacityLimit: service.capacityLimit || 100,
      healthEndpoint: '',
    });
    setShowAddForm(true);
  };

  const handleDelete = async (serviceId: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`/api/clients/${clientId}/services/${serviceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete service');
      await fetchServices();
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'website',
      description: '',
      costPerUnit: 0,
      customPrice: 0,
      capacityLimit: 100,
      healthEndpoint: '',
    });
    setEditingService(null);
    setShowAddForm(false);
  };

  const getStatusColor = (status: string, healthScore: number) => {
    if (status === 'inactive') return 'bg-red-100 text-red-800';
    if (healthScore < 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusIcon = (status: string, healthScore: number) => {
    if (status === 'inactive') return XCircle;
    if (healthScore < 70) return AlertTriangle;
    return CheckCircle;
  };

  const handleServiceClick = (serviceId: number) => {
    window.location.href = `/clients/${clientId}/services/${serviceId}`;
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading services...</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Services</h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage services for {clientName}
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </button>
        </div>
      </div>

      {error && (
        <div className="px-6 py-4 bg-red-50 border-l-4 border-red-400">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Service Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Service Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {serviceTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Base Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.costPerUnit}
                  onChange={(e) => setFormData(prev => ({ ...prev, costPerUnit: parseFloat(e.target.value) }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Custom Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.customPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, customPrice: parseFloat(e.target.value) }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Capacity Limit
                </label>
                <input
                  type="number"
                  value={formData.capacityLimit}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacityLimit: parseInt(e.target.value) }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {editingService ? 'Update' : 'Create'} Service
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List */}
      <div className="px-6 py-4">
        {services.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Server className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No services</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a service for this client.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => {
              const ServiceIcon = serviceIcons[service.type] || serviceIcons.default;
              const StatusIcon = getStatusIcon(service.status, service.healthScore);
              
              return (
                <div
                  key={service.id}
                  className="relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleServiceClick(service.id)}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <ServiceIcon className="w-6 h-6 text-indigo-600" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {service.name}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">{service.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleEdit(service)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {service.description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {service.description}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <span
                        className={classNames(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          getStatusColor(service.status, service.healthScore)
                        )}
                      >
                        <StatusIcon className="mr-1 w-3 h-3" />
                        {service.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                      <div className="text-sm text-gray-500">
                        Health: {service.healthScore}%
                      </div>
                    </div>

                    {(service.costPerUnit || service.customPrice) && (
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-gray-500">Pricing:</span>
                        <div className="flex items-center space-x-2">
                          {service.costPerUnit && (
                            <span className="text-gray-400 line-through">
                              ${service.costPerUnit}
                            </span>
                          )}
                          {service.customPrice && (
                            <span className="font-medium text-gray-900">
                              ${service.customPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {service.currentUsage !== undefined && service.capacityLimit && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Usage</span>
                          <span>{service.currentUsage}% of {service.capacityLimit}</span>
                        </div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={classNames(
                              'h-2 rounded-full transition-all',
                              service.currentUsage > 80 ? 'bg-red-500' : 
                              service.currentUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                            )}
                            style={{ width: `${Math.min(service.currentUsage, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {service.metrics && service.metrics.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="text-xs text-gray-500 mb-2">Recent Metrics:</div>
                        <div className="space-y-1">
                          {service.metrics.slice(0, 2).map((metric) => (
                            <div key={metric.id} className="flex justify-between text-xs">
                              <span className="text-gray-600">{metric.name}</span>
                              <span className="font-medium">
                                {metric.value} {metric.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* View Details Link */}
                    <div className="mt-3 pt-3 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
                      <Link
                        href={`/clients/${clientId}/services/${service.id}`}
                        className="flex items-center justify-center text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        <ExternalLink className="mr-1 h-4 w-4" />
                        View Details & Analytics
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 