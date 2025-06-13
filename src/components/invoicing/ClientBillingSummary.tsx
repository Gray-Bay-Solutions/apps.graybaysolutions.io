'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  DollarSign, 
  Plus,
  Eye,
  ArrowRight,
  Clock,
  CheckCircle,
  Minus,
  X,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PRODUCT_CATALOG, Product, getCoreServices, getMonthlyServices, getAddOns } from '@/lib/products';
import QuoteBuilder from './QuoteBuilder';
import InvoiceBuilder from './InvoiceBuilder';

interface ClientBillingSummaryProps {
  clientId: number;
  clientName: string;
}

interface QuickInvoiceItem {
  productId: string;
  quantity: number;
}

interface BillingStats {
  totalPaid: number;
  monthlyRecurring: number;
  pendingAmount: number;
  recentQuotes: Array<{
    id: string;
    amount: number;
    status: string;
    validUntil: string;
  }>;
  recentInvoices: Array<{
    id: string;
    invoiceNumber: string;
    amount: number;
    status: string;
    type: string;
    dueDate: string;
  }>;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ClientBillingSummary({ clientId, clientName }: ClientBillingSummaryProps) {
  const router = useRouter();
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false);
  const [showInvoiceBuilder, setShowInvoiceBuilder] = useState(false);
  const [showServiceSelector, setShowServiceSelector] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'core' | 'monthly' | 'addon'>('core');
  const [quickInvoiceItems, setQuickInvoiceItems] = useState<QuickInvoiceItem[]>([]);
  const [billingStats, setBillingStats] = useState<BillingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch billing stats for this client
  useEffect(() => {
    const fetchBillingStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/billing/stats?clientId=${clientId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch billing stats');
        }
        const data = await response.json();
        setBillingStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch billing stats');
      } finally {
        setLoading(false);
      }
    };

    fetchBillingStats();
  }, [clientId]);

  const handleQuoteSave = async (quote: any) => {
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...quote,
          clientId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save quote');
      }

      setShowQuoteBuilder(false);
      // Refresh billing stats
      const statsResponse = await fetch(`/api/billing/stats?clientId=${clientId}`);
      if (statsResponse.ok) {
        const data = await statsResponse.json();
        setBillingStats(data);
      }
    } catch (err) {
      console.error('Error saving quote:', err);
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
          clientId,
          status: 'sent',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send quote');
      }

      setShowQuoteBuilder(false);
      // Refresh billing stats
      const statsResponse = await fetch(`/api/billing/stats?clientId=${clientId}`);
      if (statsResponse.ok) {
        const data = await statsResponse.json();
        setBillingStats(data);
      }
    } catch (err) {
      console.error('Error sending quote:', err);
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
          clientId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save invoice');
      }

      setShowInvoiceBuilder(false);
      setQuickInvoiceItems([]);
      // Refresh billing stats
      const statsResponse = await fetch(`/api/billing/stats?clientId=${clientId}`);
      if (statsResponse.ok) {
        const data = await statsResponse.json();
        setBillingStats(data);
      }
    } catch (err) {
      console.error('Error saving invoice:', err);
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
          clientId,
          status: 'sent',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send invoice');
      }

      setShowInvoiceBuilder(false);
      setQuickInvoiceItems([]);
      // Refresh billing stats
      const statsResponse = await fetch(`/api/billing/stats?clientId=${clientId}`);
      if (statsResponse.ok) {
        const data = await statsResponse.json();
        setBillingStats(data);
      }
    } catch (err) {
      console.error('Error sending invoice:', err);
    }
  };

  const addQuickItem = (product: Product) => {
    const existingItemIndex = quickInvoiceItems.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...quickInvoiceItems];
      updatedItems[existingItemIndex].quantity += 1;
      setQuickInvoiceItems(updatedItems);
    } else {
      setQuickInvoiceItems(prev => [...prev, { productId: product.id, quantity: 1 }]);
    }
  };

  const removeQuickItem = (productId: string) => {
    setQuickInvoiceItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuickItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeQuickItem(productId);
      return;
    }

    setQuickInvoiceItems(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const createQuickInvoice = () => {
    if (quickInvoiceItems.length === 0) {
      setShowServiceSelector(true);
      return;
    }

    // Create invoice with selected items
    const initialInvoice = {
      clientId,
      clientName,
      title: `Invoice for ${clientName}`,
      description: 'Services invoice',
      items: quickInvoiceItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      invoiceNumber: '',
      type: 'custom' as const,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft' as const,
      subtotal: 0,
      tax: 0,
      total: 0,
      taxRate: 0,
      notes: 'Payment due within 30 days.'
    };

    setShowInvoiceBuilder(true);
  };

  const calculateQuickTotal = () => {
    return quickInvoiceItems.reduce((total, item) => {
      const product = PRODUCT_CATALOG.find(p => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const goToFullBilling = () => {
    router.push(`/billing?client=${clientId}`);
  };

  const currentProducts = selectedCategory === 'core' ? getCoreServices() :
                          selectedCategory === 'monthly' ? getMonthlyServices() :
                          getAddOns();

  if (showQuoteBuilder) {
    return (
      <QuoteBuilder
        clientId={clientId}
        clientName={clientName}
        onSave={handleQuoteSave}
        onSend={handleQuoteSend}
      />
    );
  }

  if (showInvoiceBuilder) {
    return (
      <InvoiceBuilder
        clientId={clientId}
        clientName={clientName}
        type="custom"
        onSave={handleInvoiceSave}
        onSend={handleInvoiceSend}
        initialInvoice={quickInvoiceItems.length > 0 ? {
          clientId,
          clientName,
          title: `Invoice for ${clientName}`,
          description: 'Services invoice',
          items: quickInvoiceItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          })),
          invoiceNumber: '',
          type: 'custom' as const,
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'draft' as const,
          subtotal: 0,
          tax: 0,
          total: 0,
          taxRate: 0,
          notes: 'Payment due within 30 days.'
        } : undefined}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600">Loading billing information...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-700">
          Error loading billing information: {error}
        </div>
      </div>
    );
  }

  if (!billingStats) {
    return (
      <div className="text-center py-12 text-gray-500">
        No billing information available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Paid</p>
              <p className="text-2xl font-semibold text-gray-900">${billingStats?.totalPaid.toLocaleString() || 'Loading...'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Monthly Recurring</p>
              <p className="text-2xl font-semibold text-gray-900">${billingStats?.monthlyRecurring.toLocaleString() || 'Loading...'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">${billingStats?.pendingAmount.toLocaleString() || 'Loading...'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          <button
            onClick={goToFullBilling}
            className="text-sm text-indigo-600 hover:text-indigo-900 flex items-center"
          >
            View Full Billing <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quote Builder */}
          <button
            onClick={() => setShowQuoteBuilder(true)}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Quote
          </button>
          
          {/* Quick Invoice Builder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Quick Invoice</span>
              {quickInvoiceItems.length > 0 && (
                <span className="text-sm text-gray-500">
                  ${calculateQuickTotal().toLocaleString()} total
                </span>
              )}
            </div>
            
            {quickInvoiceItems.length > 0 && (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {quickInvoiceItems.map((item) => {
                  const product = PRODUCT_CATALOG.find(p => p.id === item.productId);
                  if (!product) return null;

                  return (
                    <div key={item.productId} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">{product.name}</span>
                        <span className="text-xs text-gray-500 ml-2">${product.price}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuickItemQuantity(item.productId, item.quantity - 1)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuickItemQuantity(item.productId, item.quantity + 1)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removeQuickItem(item.productId)}
                          className="text-red-400 hover:text-red-600 ml-2"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex space-x-2">
              <button
                onClick={() => setShowServiceSelector(!showServiceSelector)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Plus className="mr-1 h-3 w-3 inline" />
                Add Services
              </button>
              <button
                onClick={createQuickInvoice}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                disabled={quickInvoiceItems.length === 0}
              >
                Create Invoice
              </button>
            </div>
          </div>
        </div>

        {/* Service Selector */}
        {showServiceSelector && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-900">Add Services to Invoice</h4>
              <button
                onClick={() => setShowServiceSelector(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="border-b border-gray-200 mb-4">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'core', name: 'Core Services', count: getCoreServices().length },
                  { id: 'monthly', name: 'Monthly Services', count: getMonthlyServices().length },
                  { id: 'addon', name: 'Add-ons', count: getAddOns().length }
                ].map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id as any)}
                    className={classNames(
                      selectedCategory === category.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                      'whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium'
                    )}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </nav>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentProducts.map((product) => {
                const isAdded = quickInvoiceItems.some(item => item.productId === product.id);
                
                return (
                  <div
                    key={product.id}
                    className={classNames(
                      'border border-gray-200 rounded-lg p-3',
                      isAdded ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-gray-50'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium text-gray-900">{product.name}</h5>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-gray-900">
                          ${product.price.toLocaleString()}
                        </span>
                        {product.type === 'recurring' && (
                          <span className="text-xs text-gray-500">/month</span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-3">{product.description}</p>

                    <div className="flex items-center justify-between">
                      <span
                        className={classNames(
                          'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                          product.type === 'one-time'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        )}
                      >
                        {product.type === 'one-time' ? 'Setup Fee' : 'Monthly'}
                      </span>
                      
                      <button
                        onClick={() => isAdded ? removeQuickItem(product.id) : addQuickItem(product)}
                        className={classNames(
                          'px-2 py-1 rounded text-xs font-medium',
                          isAdded
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                        )}
                      >
                        {isAdded ? (
                          <>
                            <Minus className="mr-1 h-3 w-3 inline" />
                            Remove
                          </>
                        ) : (
                          <>
                            <Plus className="mr-1 h-3 w-3 inline" />
                            Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quotes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Quotes</h3>
          </div>
          <div className="p-6">
            {billingStats && billingStats.recentQuotes && billingStats.recentQuotes.length > 0 ? (
              <div className="space-y-4">
                {billingStats.recentQuotes.map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">${quote.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Valid until {new Date(quote.validUntil).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={classNames(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        quote.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                        quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      )}>
                        {quote.status}
                      </span>
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No quotes yet</p>
            )}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Invoices</h3>
          </div>
          <div className="p-6">
            {billingStats && billingStats.recentInvoices && billingStats.recentInvoices.length > 0 ? (
              <div className="space-y-4">
                {billingStats.recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">${invoice.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">
                        {invoice.invoiceNumber} • Due {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={classNames(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      )}>
                        {invoice.status === 'paid' && <CheckCircle className="mr-1 h-3 w-3" />}
                        {invoice.status}
                      </span>
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No invoices yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 