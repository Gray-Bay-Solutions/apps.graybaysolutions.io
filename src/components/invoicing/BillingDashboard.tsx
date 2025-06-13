'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  Plus,
  Eye,
  Send,
  Check,
  XCircle,
  RefreshCw,
  Download,
  Filter,
  Users,
  Search,
  X,
  Loader2
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import QuoteBuilder from './QuoteBuilder';
import InvoiceBuilder from './InvoiceBuilder';

interface BillingStats {
  totalRevenue: number;
  monthlyRecurring: number;
  pendingInvoices: number;
  overdueInvoices: number;
  activeQuotes: number;
  conversionRate: number;
  totalClients: number;
}

interface QuoteSummary {
  id: string;
  clientId: number;
  clientName: string;
  amount: number;
  monthlyAmount: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: string;
  createdAt: string;
  title: string;
  description: string;
  subtotal: number;
  tax: number;
  taxRate: number;
  notes: string;
  items: Array<{
    productId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    customPrice?: number;
    discount?: number;
    total: number;
  }>;
}

interface InvoiceSummary {
  id: string;
  invoiceNumber: string;
  clientId: number;
  clientName: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  type: 'setup' | 'monthly' | 'custom';
  dueDate: string;
  issueDate: string;
  paidDate?: string;
  title: string;
  description: string;
  subtotal: number;
  tax: number;
  taxRate: number;
  paymentMethod?: string;
  notes: string;
  items: Array<{
    productId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    customPrice?: number;
    discount?: number;
    total: number;
  }>;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function BillingDashboard() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'quotes' | 'invoices' | 'recurring'>('overview');
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false);
  const [showInvoiceBuilder, setShowInvoiceBuilder] = useState(false);
  const [invoiceType, setInvoiceType] = useState<'setup' | 'monthly' | 'custom'>('custom');
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [selectedClient, setSelectedClient] = useState<{id: number, name: string} | null>(null);
  const [clientFilter, setClientFilter] = useState<string>('');
  const [quoteStatusFilter, setQuoteStatusFilter] = useState<string>('all');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<string>('all');
  
  // Data state
  const [stats, setStats] = useState<BillingStats | null>(null);
  const [quotes, setQuotes] = useState<QuoteSummary[]>([]);
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get client filter from URL params
  useEffect(() => {
    const clientParam = searchParams.get('client');
    if (clientParam) {
      // In real app, fetch client name from API
      setSelectedClient({ id: parseInt(clientParam), name: 'Selected Client' });
      setClientFilter(clientParam);
    }
  }, [searchParams]);

  // Fetch billing data
  useEffect(() => {
    fetchBillingData();
  }, [clientFilter, quoteStatusFilter, invoiceStatusFilter]);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (clientFilter) params.append('clientId', clientFilter);

      // Fetch stats
      const statsResponse = await fetch(`/api/billing/stats?${params}`);
      if (!statsResponse.ok) throw new Error('Failed to fetch billing stats');
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch quotes
      const quotesParams = new URLSearchParams(params);
      if (quoteStatusFilter !== 'all') quotesParams.append('status', quoteStatusFilter);
      const quotesResponse = await fetch(`/api/quotes?${quotesParams}`);
      if (!quotesResponse.ok) throw new Error('Failed to fetch quotes');
      const quotesData = await quotesResponse.json();
      setQuotes(quotesData);

      // Fetch invoices
      const invoicesParams = new URLSearchParams(params);
      if (invoiceStatusFilter !== 'all') invoicesParams.append('status', invoiceStatusFilter);
      const invoicesResponse = await fetch(`/api/invoices?${invoicesParams}`);
      if (!invoicesResponse.ok) throw new Error('Failed to fetch invoices');
      const invoicesData = await invoicesResponse.json();
      setInvoices(invoicesData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch billing data');
    } finally {
      setLoading(false);
    }
  };

  const handleQuoteSave = async (quote: any) => {
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...quote,
          clientId: selectedClient?.id || quote.clientId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save quote');
      }

      setShowQuoteBuilder(false);
      setSelectedQuote(null);
      setSelectedClient(null);
      await fetchBillingData(); // Refresh data
    } catch (err) {
      console.error('Error saving quote:', err);
      setError(err instanceof Error ? err.message : 'Failed to save quote');
    }
  };

  const handleQuoteSend = async (quote: any) => {
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...quote,
          clientId: selectedClient?.id || quote.clientId,
          status: 'sent',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send quote');
      }

      setShowQuoteBuilder(false);
      setSelectedQuote(null);
      setSelectedClient(null);
      await fetchBillingData(); // Refresh data
    } catch (err) {
      console.error('Error sending quote:', err);
      setError(err instanceof Error ? err.message : 'Failed to send quote');
    }
  };

  const handleInvoiceSave = async (invoice: any) => {
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...invoice,
          clientId: selectedClient?.id || invoice.clientId,
          type: invoiceType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save invoice');
      }

      setShowInvoiceBuilder(false);
      setSelectedQuote(null);
      setSelectedClient(null);
      await fetchBillingData(); // Refresh data
    } catch (err) {
      console.error('Error saving invoice:', err);
      setError(err instanceof Error ? err.message : 'Failed to save invoice');
    }
  };

  const handleInvoiceSend = async (invoice: any) => {
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...invoice,
          clientId: selectedClient?.id || invoice.clientId,
          type: invoiceType,
          status: 'sent',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send invoice');
      }

      setShowInvoiceBuilder(false);
      setSelectedQuote(null);
      setSelectedClient(null);
      await fetchBillingData(); // Refresh data
    } catch (err) {
      console.error('Error sending invoice:', err);
      setError(err instanceof Error ? err.message : 'Failed to send invoice');
    }
  };

  const convertQuoteToInvoice = (quote: QuoteSummary) => {
    setSelectedQuote(quote);
    setSelectedClient({ id: quote.clientId, name: quote.clientName });
    setShowInvoiceBuilder(true);
  };

  const generateMonthlyInvoices = async () => {
    try {
      // This would be a separate API endpoint for bulk invoice generation
      console.log('Generating monthly invoices for all clients...');
      // await fetch('/api/invoices/generate-monthly', { method: 'POST' });
      // await fetchBillingData();
    } catch (err) {
      console.error('Error generating monthly invoices:', err);
    }
  };

  const clearClientFilter = () => {
    setClientFilter('');
    setSelectedClient(null);
    // Update URL without client param
    window.history.pushState({}, '', '/billing');
  };

  // Filter data based on selected client
  const filteredQuotes = clientFilter ? 
    quotes.filter(q => q.clientId === parseInt(clientFilter)) : 
    quotes;

  const filteredInvoices = clientFilter ? 
    invoices.filter(i => i.clientId === parseInt(clientFilter)) : 
    invoices;

  if (showQuoteBuilder) {
    return (
      <QuoteBuilder
        clientId={selectedClient?.id || 0}
        clientName={selectedClient?.name || 'Select Client'}
        onSave={handleQuoteSave}
        onSend={handleQuoteSend}
      />
    );
  }

  if (showInvoiceBuilder) {
    return (
      <InvoiceBuilder
        clientId={selectedClient?.id || 0}
        clientName={selectedClient?.name || 'Select Client'}
        type={invoiceType}
        onSave={handleInvoiceSave}
        onSend={handleInvoiceSend}
        fromQuote={selectedQuote}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600">Loading billing data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading billing data</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={fetchBillingData}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Billing Management
          </h1>
          <p className="text-gray-600">
            {selectedClient ? 
              `Managing billing for ${selectedClient.name}` : 
              'Manage quotes, invoices, and recurring billing across all clients'
            }
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchBillingData}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="mr-2 h-4 w-4 inline" />
            Refresh
          </button>
          <button
            onClick={() => {
              setSelectedClient(null);
              setShowQuoteBuilder(true);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            <Plus className="mr-2 h-4 w-4 inline" />
            New Quote
          </button>
          <div className="flex items-center space-x-2">
            <select
              value={invoiceType}
              onChange={(e) => setInvoiceType(e.target.value as any)}
              className="border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm"
            >
              <option value="setup">Setup Invoice</option>
              <option value="monthly">Monthly Invoice</option>
              <option value="custom">Custom Invoice</option>
            </select>
            <button
              onClick={() => {
                setSelectedClient(null);
                setShowInvoiceBuilder(true);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
            >
              <Plus className="mr-2 h-4 w-4 inline" />
              New Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Client Filter */}
      {selectedClient && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-900">
                Filtering by client: {selectedClient.name}
              </span>
            </div>
            <button
              onClick={clearClientFilter}
              className="text-blue-600 hover:text-blue-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${stats?.totalRevenue?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-green-600">+12.5% from last month</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Monthly Recurring</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${stats?.monthlyRecurring?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-blue-600">+5.2% from last month</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Invoices</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${stats?.pendingInvoices?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-gray-600">
                  {filteredInvoices.filter(i => i.status === 'sent').length} invoices
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Overdue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${stats?.overdueInvoices?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-red-600">
                  {filteredInvoices.filter(i => i.status === 'overdue').length} invoices
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', count: null },
            { id: 'quotes', name: 'Quotes', count: filteredQuotes.length },
            { id: 'invoices', name: 'Invoices', count: filteredInvoices.length },
            { id: 'recurring', name: 'Recurring', count: filteredInvoices.filter(i => i.type === 'monthly').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={classNames(
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium'
              )}
            >
              {tab.name}
              {tab.count !== null && (
                <span className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-900">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Quotes */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Quotes</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {filteredQuotes.slice(0, 5).map((quote) => (
                    <div key={quote.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{quote.clientName}</p>
                        <p className="text-sm text-gray-600">
                          ${quote.amount.toLocaleString()} setup + ${quote.monthlyAmount}/month
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={classNames(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          quote.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                          quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          quote.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                          'bg-gray-100 text-gray-800'
                        )}>
                          {quote.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Valid until {new Date(quote.validUntil).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Invoices */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Invoices</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {filteredInvoices.slice(0, 5).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{invoice.clientName}</p>
                        <p className="text-sm text-gray-600">
                          {invoice.invoiceNumber} • ${invoice.amount.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={classNames(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                          invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        )}>
                          {invoice.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Due {new Date(invoice.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quotes' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Quotes</h3>
                <div className="flex space-x-2">
                  <select
                    value={quoteStatusFilter}
                    onChange={(e) => setQuoteStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-md py-1 px-3 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="expired">Expired</option>
                  </select>
                  <button
                    onClick={() => {
                      setSelectedClient(null);
                      setShowQuoteBuilder(true);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    <Plus className="mr-2 h-4 w-4 inline" />
                    New Quote
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quote
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valid Until
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredQuotes.map((quote) => (
                    <tr key={quote.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{quote.id}</div>
                          <div className="text-sm text-gray-500">{quote.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {quote.clientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${quote.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={classNames(
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          quote.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                          quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          quote.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        )}>
                          {quote.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(quote.validUntil).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        {quote.status === 'accepted' && (
                          <button
                            onClick={() => convertQuoteToInvoice(quote)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredQuotes.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No quotes found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Invoices</h3>
                <div className="flex space-x-2">
                  <select
                    value={invoiceStatusFilter}
                    onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-md py-1 px-3 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select
                    value={invoiceType}
                    onChange={(e) => setInvoiceType(e.target.value as any)}
                    className="border border-gray-300 rounded-md py-1 px-3 text-sm"
                  >
                    <option value="setup">Setup Invoice</option>
                    <option value="monthly">Monthly Invoice</option>
                    <option value="custom">Custom Invoice</option>
                  </select>
                  <button
                    onClick={() => {
                      setSelectedClient(null);
                      setShowInvoiceBuilder(true);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    <Plus className="mr-2 h-4 w-4 inline" />
                    New Invoice
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                          <div className="text-sm text-gray-500">{invoice.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.clientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${invoice.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={classNames(
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          invoice.type === 'setup' ? 'bg-purple-100 text-purple-800' :
                          invoice.type === 'monthly' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        )}>
                          {invoice.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={classNames(
                          'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                          invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                          invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          invoice.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        )}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Download className="h-4 w-4" />
                        </button>
                        {invoice.status === 'draft' && (
                          <button className="text-blue-600 hover:text-blue-900">
                            <Send className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredInvoices.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No invoices found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'recurring' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Recurring Billing</h3>
                <button
                  onClick={generateMonthlyInvoices}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Generate Monthly Invoices
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total MRR</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${stats?.monthlyRecurring?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Active Quotes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.activeQuotes || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalClients || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.conversionRate?.toFixed(1) || '0'}%</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Monthly Recurring Services</h4>
                {filteredInvoices
                  .filter(invoice => invoice.type === 'monthly')
                  .map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{invoice.clientName}</p>
                        <p className="text-sm text-gray-600">{invoice.title || 'Monthly Services'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${invoice.amount.toLocaleString()}/month</p>
                        <p className={classNames(
                          'text-sm',
                          invoice.status === 'paid' ? 'text-green-600' :
                          invoice.status === 'overdue' ? 'text-red-600' :
                          'text-yellow-600'
                        )}>
                          {invoice.status === 'paid' ? 'Paid' :
                           invoice.status === 'overdue' ? 'Overdue' :
                           'Pending'}
                        </p>
                      </div>
                    </div>
                  ))}
                {filteredInvoices.filter(invoice => invoice.type === 'monthly').length === 0 && (
                  <p className="text-gray-500 text-center py-4">No monthly recurring invoices found</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 