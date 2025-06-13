'use client';

import { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Plus,
  Eye,
  ArrowRight,
  User,
  Calendar,
  Settings,
  GitPullRequest,
  Loader2,
  RefreshCw,
  Edit,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import TicketForm from './TicketForm';

interface ClientTicketSummaryProps {
  clientId: number;
  clientName: string;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'pending_approval' | 'scheduled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: 'feature_request' | 'configuration' | 'customization' | 'maintenance' | 'bug' | 'support';
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  scheduledFor?: string;
  services: string[];
  impact?: string;
}

interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  avgResponseTime: string;
  avgResolutionTime: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ClientTicketSummary({ clientId, clientName }: ClientTicketSummaryProps) {
  const router = useRouter();
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tickets for this client
  useEffect(() => {
    fetchTickets();
  }, [clientId]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/tickets?clientId=${clientId}`);
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

  // Calculate stats from tickets
  const ticketStats: TicketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    avgResponseTime: '2.4 hours', // This would be calculated from actual data
    avgResolutionTime: '1.2 days' // This would be calculated from actual data
  };

  // Get recent tickets (last 3)
  const recentTickets = tickets
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

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

  const goToFullSupport = () => {
    router.push(`/support?client=${clientId}`);
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
        return <AlertTriangle className="h-4 w-4" />;
      case 'customization':
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
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
        clientId={clientId}
        clientName={clientName}
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Tickets</p>
              <p className="text-2xl font-semibold text-gray-900">
                {loading ? '...' : ticketStats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Open</p>
              <p className="text-2xl font-semibold text-gray-900">
                {loading ? '...' : ticketStats.open}
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
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">
                {loading ? '...' : ticketStats.inProgress}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Resolved</p>
              <p className="text-2xl font-semibold text-gray-900">
                {loading ? '...' : ticketStats.resolved}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          <div className="flex space-x-2">
            <button
              onClick={fetchTickets}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
              disabled={loading}
            >
              <RefreshCw className={classNames("mr-1 h-4 w-4", loading ? "animate-spin" : "")} />
              Refresh
            </button>
            <button
              onClick={goToFullSupport}
              className="text-sm text-indigo-600 hover:text-indigo-900 flex items-center"
            >
              View All Tickets <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              setSelectedTicket(null);
              setShowTicketForm(true);
            }}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Ticket
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-3 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-500">Avg Response</p>
              <p className="text-sm font-medium text-gray-900">{ticketStats.avgResponseTime}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-500">Avg Resolution</p>
              <p className="text-sm font-medium text-gray-900">{ticketStats.avgResolutionTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Tickets</h3>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Loading tickets...</span>
            </div>
          ) : recentTickets.length > 0 ? (
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="text-gray-400">
                          {getTypeIcon(ticket.type)}
                        </div>
                        <h4 className="text-sm font-medium text-gray-900">{ticket.title}</h4>
                        <span className="text-xs text-gray-500">#{ticket.id}</span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                        {ticket.assignee && (
                          <div className="flex items-center">
                            <User className="mr-1 h-3 w-3" />
                            {ticket.assignee}
                          </div>
                        )}
                        {ticket.scheduledFor && (
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            Scheduled: {ticket.scheduledFor}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-3">
                        {ticket.services.map((service) => (
                          <span
                            key={service}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <span className={classNames(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        getStatusColor(ticket.status)
                      )}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                      
                      <span className={classNames(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        getPriorityColor(ticket.priority)
                      )}>
                        {ticket.priority}
                      </span>
                      
                      <div className="flex space-x-1">
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
                          onClick={() => router.push(`/support?client=${clientId}`)}
                          className="text-gray-600 hover:text-gray-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create your first support ticket to get started.
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
                  Create Ticket
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 