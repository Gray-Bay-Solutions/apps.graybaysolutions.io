'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  MessageCircle, 
  AlertTriangle, 
  Clock, 
  Settings,
  GitPullRequest,
  Bug,
  HelpCircle,
  Loader2
} from 'lucide-react';

interface TicketFormProps {
  clientId: number;
  clientName: string;
  onSave: (ticket: any) => void;
  onCancel: () => void;
  initialTicket?: any;
}

interface TicketData {
  title: string;
  description: string;
  type: 'feature_request' | 'configuration' | 'customization' | 'maintenance' | 'bug' | 'support';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status?: 'open' | 'in_progress' | 'resolved' | 'pending_approval' | 'scheduled';
  services: string[];
  scheduledFor?: string;
  impact?: string;
  assignee?: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function TicketForm({ 
  clientId, 
  clientName, 
  onSave, 
  onCancel, 
  initialTicket 
}: TicketFormProps) {
  const [ticket, setTicket] = useState<TicketData>({
    title: initialTicket?.title || '',
    description: initialTicket?.description || '',
    type: initialTicket?.type || 'support',
    priority: initialTicket?.priority || 'medium',
    status: initialTicket?.status || 'open',
    services: initialTicket?.services || [],
    scheduledFor: initialTicket?.scheduledFor || '',
    impact: initialTicket?.impact || '',
    assignee: initialTicket?.assignee || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [availableServices, setAvailableServices] = useState<string[]>([]);

  // Fetch available services for the client
  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch(`/api/services?clientId=${clientId}`);
        if (response.ok) {
          const services = await response.json();
          setAvailableServices(services.map((s: any) => s.name));
        } else {
          // Fallback to mock services
          setAvailableServices([
            'Website',
            'Chatbot',
            'Analytics',
            'API Gateway',
            'Email Automation',
            'SEO Management',
            'Social Media'
          ]);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        // Fallback to mock services
        setAvailableServices([
          'Website',
          'Chatbot',
          'Analytics',
          'API Gateway',
          'Email Automation',
          'SEO Management',
          'Social Media'
        ]);
      }
    }

    if (clientId) {
      fetchServices();
    }
  }, [clientId]);

  const ticketTypes = [
    { id: 'support', name: 'General Support', icon: HelpCircle, description: 'General questions and support requests' },
    { id: 'bug', name: 'Bug Report', icon: Bug, description: 'Report issues or bugs in existing services' },
    { id: 'feature_request', name: 'Feature Request', icon: GitPullRequest, description: 'Request new features or enhancements' },
    { id: 'configuration', name: 'Configuration Change', icon: Settings, description: 'Modify existing service configurations' },
    { id: 'customization', name: 'Customization', icon: MessageCircle, description: 'Custom modifications to services' },
    { id: 'maintenance', name: 'Maintenance', icon: Clock, description: 'Scheduled maintenance or updates' }
  ];

  const priorities = [
    { id: 'low', name: 'Low', color: 'bg-green-100 text-green-800', description: 'Non-urgent, can wait' },
    { id: 'medium', name: 'Medium', color: 'bg-yellow-100 text-yellow-800', description: 'Normal priority' },
    { id: 'high', name: 'High', color: 'bg-orange-100 text-orange-800', description: 'Important, needs attention' },
    { id: 'critical', name: 'Critical', color: 'bg-red-100 text-red-800', description: 'Urgent, immediate attention required' }
  ];

  const statuses = [
    { id: 'open', name: 'Open', color: 'bg-red-100 text-red-800', description: 'New ticket, not yet started' },
    { id: 'in_progress', name: 'In Progress', color: 'bg-blue-100 text-blue-800', description: 'Currently being worked on' },
    { id: 'scheduled', name: 'Scheduled', color: 'bg-purple-100 text-purple-800', description: 'Scheduled for future work' },
    { id: 'pending_approval', name: 'Pending Approval', color: 'bg-yellow-100 text-yellow-800', description: 'Waiting for client approval' },
    { id: 'resolved', name: 'Resolved', color: 'bg-green-100 text-green-800', description: 'Completed and resolved' }
  ];

  const assignees = [
    'John Smith',
    'Emma Wilson',
    'Michael Brown',
    'Sarah Davis',
    'David Johnson'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!ticket.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!ticket.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (ticket.services.length === 0) {
      newErrors.services = 'At least one service must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const ticketData = {
        ...ticket,
        clientId,
        clientName
      };

      let response;
      if (initialTicket) {
        // Update existing ticket
        response = await fetch(`/api/tickets/${initialTicket.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ticketData),
        });
      } else {
        // Create new ticket
        response = await fetch('/api/tickets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ticketData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save ticket');
      }

      const savedTicket = await response.json();
      onSave(savedTicket);
    } catch (error: any) {
      console.error('Error saving ticket:', error);
      setErrors({ submit: error.message || 'Failed to save ticket. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (service: string) => {
    setTicket(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = ticketTypes.find(t => t.id === type);
    if (!typeConfig) return <HelpCircle className="h-5 w-5" />;
    const Icon = typeConfig.icon;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            {initialTicket ? 'Edit Ticket' : 'Create New Ticket'} for {clientName}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={ticket.title}
            onChange={(e) => setTicket(prev => ({ ...prev, title: e.target.value }))}
            className={classNames(
              'w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500',
              errors.title ? 'border-red-300' : 'border-gray-300'
            )}
            placeholder="Brief description of the issue or request"
            disabled={loading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ticket Type *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ticketTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setTicket(prev => ({ ...prev, type: type.id as any }))}
                disabled={loading}
                className={classNames(
                  'flex items-start p-3 border rounded-lg text-left hover:bg-gray-50 disabled:opacity-50',
                  ticket.type === type.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300'
                )}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <type.icon className={classNames(
                    'h-5 w-5',
                    ticket.type === type.id ? 'text-indigo-600' : 'text-gray-400'
                  )} />
                </div>
                <div className="ml-3">
                  <p className={classNames(
                    'text-sm font-medium',
                    ticket.type === type.id ? 'text-indigo-900' : 'text-gray-900'
                  )}>
                    {type.name}
                  </p>
                  <p className={classNames(
                    'text-xs',
                    ticket.type === type.id ? 'text-indigo-700' : 'text-gray-500'
                  )}>
                    {type.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Priority and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {priorities.map((priority) => (
                <button
                  key={priority.id}
                  type="button"
                  onClick={() => setTicket(prev => ({ ...prev, priority: priority.id as any }))}
                  disabled={loading}
                  className={classNames(
                    'flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50 disabled:opacity-50',
                    ticket.priority === priority.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300'
                  )}
                >
                  <span className={classNames(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2',
                    priority.color
                  )}>
                    {priority.name}
                  </span>
                  <p className="text-xs text-gray-500 text-center">{priority.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Status (only show for editing) */}
          {initialTicket && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="grid grid-cols-1 gap-2">
                {statuses.map((status) => (
                  <button
                    key={status.id}
                    type="button"
                    onClick={() => setTicket(prev => ({ ...prev, status: status.id as any }))}
                    disabled={loading}
                    className={classNames(
                      'flex items-center p-3 border rounded-lg text-left hover:bg-gray-50 disabled:opacity-50',
                      ticket.status === status.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-300'
                    )}
                  >
                    <span className={classNames(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-3',
                      status.color
                    )}>
                      {status.name}
                    </span>
                    <p className="text-xs text-gray-500">{status.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Services */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Affected Services *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableServices.map((service) => (
              <button
                key={service}
                type="button"
                onClick={() => toggleService(service)}
                disabled={loading}
                className={classNames(
                  'flex items-center justify-center px-3 py-2 border rounded-md text-sm font-medium disabled:opacity-50',
                  ticket.services.includes(service)
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                )}
              >
                {service}
              </button>
            ))}
          </div>
          {errors.services && (
            <p className="mt-1 text-sm text-red-600">{errors.services}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            rows={4}
            value={ticket.description}
            onChange={(e) => setTicket(prev => ({ ...prev, description: e.target.value }))}
            className={classNames(
              'w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500',
              errors.description ? 'border-red-300' : 'border-gray-300'
            )}
            placeholder="Detailed description of the issue, request, or requirements..."
            disabled={loading}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Optional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignee (Optional)
            </label>
            <select
              value={ticket.assignee}
              onChange={(e) => setTicket(prev => ({ ...prev, assignee: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            >
              <option value="">Unassigned</option>
              {assignees.map(assignee => (
                <option key={assignee} value={assignee}>{assignee}</option>
              ))}
            </select>
          </div>

          {/* Scheduled For */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Schedule (Optional)
            </label>
            <input
              type="date"
              value={ticket.scheduledFor}
              onChange={(e) => setTicket(prev => ({ ...prev, scheduledFor: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              min={new Date().toISOString().split('T')[0]}
              disabled={loading}
            />
          </div>

          {/* Impact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Impact (Optional)
            </label>
            <input
              type="text"
              value={ticket.impact}
              onChange={(e) => setTicket(prev => ({ ...prev, impact: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Customer Service, Sales, Operations"
              disabled={loading}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {loading ? 'Saving...' : (initialTicket ? 'Update Ticket' : 'Create Ticket')}
          </button>
        </div>
      </form>
    </div>
  );
} 