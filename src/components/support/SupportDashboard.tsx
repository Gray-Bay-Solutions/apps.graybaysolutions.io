'use client';

import { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  Users,
  Calendar,
  Settings,
  GitPullRequest,
  Bug,
  HelpCircle,
  X,
  ArrowUpCircle,
  TrendingUp,
  User,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import TicketForm from './TicketForm';

interface SupportStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  criticalTickets: number;
  avgResponseTime: string;
  avgResolutionTime: string;
  clientSatisfaction: number;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'pending_approval' | 'scheduled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: 'feature_request' | 'configuration' | 'customization' | 'maintenance' | 'bug' | 'support';
  clientId: number;
  clientName: string;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  scheduledFor?: string;
  services: string[];
  impact?: string;
}

interface Client {
  id: number;
  name: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function SupportDashboard() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'tickets' | 'deployments' | 'analytics'>('overview');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  // Get client filter from URL params
  useEffect(() => {
    const clientParam = searchParams.get('client');
    if (clientParam) {
      const clientId = parseInt(clientParam);
      // Find client name from clients list or fetch it
      fetchClientName(clientId);
    }
  }, [searchParams]);

  // Fetch tickets and clients on component mount
  useEffect(() => {
    fetchTickets();
    fetchClients();
  }, [selectedClient, statusFilter, priorityFilter, typeFilter, assigneeFilter]);

  const fetchClientName = async (clientId: number) => {
    try {
      const response = await fetch(`/api/clients/${clientId}`);
      if (response.ok) {
        const client = await response.json();
        setSelectedClient({ id: clientId, name: client.name });
      }
    } catch (error) {
      console.error('Error fetching client:', error);
    }
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (selectedClient) params.append('clientId', selectedClient.id.toString());
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (assigneeFilter !== 'all') params.append('assignee', assigneeFilter);

      const response = await fetch(`/api/tickets?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      
      const ticketsData = await response.json();
      setTickets(ticketsData);
    } catch (error: any) {
      console.error('Error fetching tickets:', error);
      setError(error.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      if (response.ok) {
        const clientsData = await response.json();
        setClients(clientsData.map((c: any) => ({ id: c.id, name: c.name })));
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  // Filter tickets based on search query (client-side filtering for search)
  const filteredTickets = tickets.filter(ticket => {
    if (searchQuery && !ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Calculate stats from filtered tickets
  const stats: SupportStats = {
    totalTickets: filteredTickets.length,
    openTickets: filteredTickets.filter(t => t.status === 'open').length,
    inProgressTickets: filteredTickets.filter(t => t.status === 'in_progress').length,
    resolvedTickets: filteredTickets.filter(t => t.status === 'resolved').length,
    criticalTickets: filteredTickets.filter(t => t.priority === 'critical').length,
    avgResponseTime: '2.4 hours',
    avgResolutionTime: '1.8 days',
    clientSatisfaction: 94.2
  };

  const uniqueAssignees = [...new Set(tickets.map(t => t.assignee).filter(Boolean))];

  const handleTicketSave = (ticketData: any) => {
    // Refresh tickets after save
    fetchTickets();
    setShowTicketForm(false);
    setSelectedTicket(null);
  };

  const handleEditTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowTicketForm(true);
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return;

    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete ticket');
      }

      // Refresh tickets after deletion
      fetchTickets();
    } catch (error: any) {
      console.error('Error deleting ticket:', error);
      alert('Failed to delete ticket: ' + error.message);
    }
  };

  const handleQuickResolve = async (ticketId: string) => {
    if (!confirm('Mark this ticket as resolved?')) return;

    try {
      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) return;

      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...ticket,
          status: 'resolved'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to resolve ticket');
      }

      // Refresh tickets after update
      fetchTickets();
    } catch (error: any) {
      console.error('Error resolving ticket:', error);
      alert('Failed to resolve ticket: ' + error.message);
    }
  };

  const clearClientFilter = () => {
    setSelectedClient(null);
    // Update URL without client param
    window.history.pushState({}, '', '/support');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature_request':
        return <GitPullRequest className="h-4 w-4" />;
      case 'configuration':
        return <Settings className="h-4 w-4" />;
      case 'maintenance':
        return <Clock className="h-4 w-4" />;
      case 'bug':
        return <Bug className="h-4 w-4" />;
      case 'customization':
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (showTicketForm) {
    return (
      <TicketForm
        clientId={selectedClient?.id || 0}
        clientName={selectedClient?.name || 'Select Client'}
        onSave={handleTicketSave}
        onCancel={() => {
          setShowTicketForm(false);
          setSelectedTicket(null);
        }}
        initialTicket={selectedTicket}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Support Dashboard
          </h1>
          <p className="text-gray-600">
            {selectedClient ? 
              `Managing support for ${selectedClient.name}` : 
              'Manage tickets, deployments, and support across all clients'
            }
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchTickets}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
            disabled={loading}
          >
            <RefreshCw className={classNames("mr-2 h-4 w-4 inline", loading ? "animate-spin" : "")} />
            Refresh
          </button>
          <button
            onClick={() => {
              setSelectedTicket(null);
              setShowTicketForm(true);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            <Plus className="mr-2 h-4 w-4 inline" />
            New Ticket
          </button>
        </div>
      </div>

      {/* Client Filter */}
      {selectedClient && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-900">
                Filtered by client: {selectedClient.name}
              </span>
            </div>
            <button
              onClick={clearClientFilter}
              className="text-blue-600 hover:text-blue-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Tickets</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalTickets}</p>
              <p className="text-sm text-blue-600">+8% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Open Tickets</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.openTickets}</p>
              <p className="text-sm text-gray-600">
                {stats.criticalTickets} critical
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Response Time</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.avgResponseTime}</p>
              <p className="text-sm text-green-600">-15% improvement</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Client Satisfaction</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.clientSatisfaction}%</p>
              <p className="text-sm text-green-600">+2.1% from last month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="scheduled">Scheduled</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="support">Support</option>
              <option value="bug">Bug</option>
              <option value="feature_request">Feature Request</option>
              <option value="configuration">Configuration</option>
              <option value="customization">Customization</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          {/* Assignee Filter */}
          <div>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Assignees</option>
              {uniqueAssignees.map(assignee => (
                <option key={assignee} value={assignee}>{assignee}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Support Tickets ({filteredTickets.length})
          </h3>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading tickets...</span>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedClient ? 'This client has no tickets yet.' : 'No tickets match your current filters.'}
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSelectedTicket(null);
                  setShowTicketForm(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create your first ticket
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <div className="text-gray-400">
                            {getTypeIcon(ticket.type)}
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{ticket.title}</p>
                          <p className="text-sm text-gray-500">#{ticket.id}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {ticket.services.map((service) => (
                              <span
                                key={service}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.clientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {ticket.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={classNames(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        getPriorityColor(ticket.priority)
                      )}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={classNames(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        getStatusColor(ticket.status)
                      )}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.assignee ? (
                        <div className="flex items-center">
                          <User className="mr-1 h-3 w-3 text-gray-400" />
                          {ticket.assignee}
                        </div>
                      ) : (
                        <span className="text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {ticket.status !== 'resolved' && (
                          <button
                            onClick={() => handleQuickResolve(ticket.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Quick Resolve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEditTicket(ticket)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit Ticket"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTicket(ticket.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Ticket"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 