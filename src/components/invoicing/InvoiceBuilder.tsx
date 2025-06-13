'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  Send, 
  Save,
  Eye,
  Check,
  X,
  Plus,
  Minus,
  RefreshCw
} from 'lucide-react';
import { PRODUCT_CATALOG, Product, calculateTotal } from '@/lib/products';

interface InvoiceItem {
  productId: string;
  quantity: number;
  customPrice?: number;
  discount?: number;
  description?: string;
}

interface InvoiceData {
  clientId: number;
  clientName: string;
  invoiceNumber: string;
  type: 'setup' | 'monthly' | 'custom';
  title: string;
  description: string;
  items: InvoiceItem[];
  issueDate: string;
  dueDate: string;
  notes: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  paymentMethod?: string;
  subtotal: number;
  tax?: number;
  taxRate?: number;
  total: number;
}

interface InvoiceBuilderProps {
  clientId: number;
  clientName: string;
  type?: 'setup' | 'monthly' | 'custom';
  onSave?: (invoice: InvoiceData) => void;
  onSend?: (invoice: InvoiceData) => void;
  initialInvoice?: InvoiceData;
  fromQuote?: any; // QuoteData from QuoteBuilder
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function InvoiceBuilder({ 
  clientId, 
  clientName, 
  type = 'custom',
  onSave, 
  onSend, 
  initialInvoice,
  fromQuote
}: InvoiceBuilderProps) {
  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}-${random}`;
  };

  const [invoice, setInvoice] = useState<InvoiceData>({
    clientId,
    clientName,
    invoiceNumber: generateInvoiceNumber(),
    type,
    title: type === 'setup' ? `Setup Services - ${clientName}` : 
           type === 'monthly' ? `Monthly Services - ${clientName}` : 
           `Invoice - ${clientName}`,
    description: type === 'setup' ? 'One-time setup and configuration services' :
                 type === 'monthly' ? 'Monthly recurring service management' :
                 'Professional services',
    items: [],
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    notes: type === 'setup' ? 'Payment due within 30 days. Setup will begin upon payment confirmation.' :
           type === 'monthly' ? 'Monthly service payment. Services continue upon payment.' :
           'Payment due within 30 days.',
    status: 'draft',
    subtotal: 0,
    taxRate: 0,
    tax: 0,
    total: 0
  });

  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (initialInvoice) {
      setInvoice(initialInvoice);
    } else if (fromQuote) {
      // Convert quote to invoice
      const quoteItems = fromQuote.items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        customPrice: item.customPrice,
        discount: item.discount
      }));

      setInvoice(prev => ({
        ...prev,
        title: fromQuote.title.replace('Proposal', 'Invoice'),
        description: fromQuote.description,
        items: quoteItems,
        notes: fromQuote.notes + '\n\nConverted from quote dated ' + new Date().toLocaleDateString()
      }));
    }
  }, [initialInvoice, fromQuote]);

  // Recalculate totals whenever items change
  useEffect(() => {
    const subtotal = invoice.items.reduce((sum, item) => {
      const product = PRODUCT_CATALOG.find(p => p.id === item.productId);
      if (!product) return sum;

      const basePrice = item.customPrice || product.price;
      const discountAmount = item.discount ? (basePrice * item.discount / 100) : 0;
      return sum + ((basePrice - discountAmount) * item.quantity);
    }, 0);

    const tax = invoice.taxRate ? (subtotal * invoice.taxRate / 100) : 0;
    const total = subtotal + tax;

    setInvoice(prev => ({
      ...prev,
      subtotal,
      tax,
      total
    }));
  }, [invoice.items, invoice.taxRate]);

  const addItem = (product: Product) => {
    const existingItemIndex = invoice.items.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...invoice.items];
      updatedItems[existingItemIndex].quantity += 1;
      setInvoice(prev => ({ ...prev, items: updatedItems }));
    } else {
      setInvoice(prev => ({
        ...prev,
        items: [...prev.items, { productId: product.id, quantity: 1 }]
      }));
    }
  };

  const removeItem = (productId: string) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.productId !== productId)
    }));
  };

  const updateItem = (productId: string, updates: Partial<InvoiceItem>) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.productId === productId ? { ...item, ...updates } : item
      )
    }));
  };

  const addCustomItem = () => {
    const customId = `custom-${Date.now()}`;
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, {
        productId: customId,
        quantity: 1,
        customPrice: 0,
        description: 'Custom Service'
      }]
    }));
  };

  const calculateItemTotal = (item: InvoiceItem): number => {
    const product = PRODUCT_CATALOG.find(p => p.id === item.productId);
    const basePrice = item.customPrice || (product?.price || 0);
    const discountAmount = item.discount ? (basePrice * item.discount / 100) : 0;
    return (basePrice - discountAmount) * item.quantity;
  };

  const handleSave = async () => {
    if (onSave) {
      onSave(invoice);
    }
  };

  const handleSend = async () => {
    const updatedInvoice = { ...invoice, status: 'sent' as const };
    setInvoice(updatedInvoice);
    if (onSend) {
      onSend(updatedInvoice);
    }
  };

  if (showPreview) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Preview Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Invoice Preview</h3>
            <button
              onClick={() => setShowPreview(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Invoice Preview Content */}
        <div className="p-8 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
            <p className="text-gray-600">Graybay Digital Services</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
              <p className="text-gray-700">{clientName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Invoice #: {invoice.invoiceNumber}</p>
              <p className="text-sm text-gray-600">Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{invoice.title}</h2>
            <p className="text-gray-700">{invoice.description}</p>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-200 px-4 py-2 text-left">Description</th>
                  <th className="border border-gray-200 px-4 py-2 text-center">Qty</th>
                  <th className="border border-gray-200 px-4 py-2 text-right">Rate</th>
                  <th className="border border-gray-200 px-4 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => {
                  const product = PRODUCT_CATALOG.find(p => p.id === item.productId);
                  const isCustom = item.productId.startsWith('custom-');

                  return (
                    <tr key={item.productId}>
                      <td className="border border-gray-200 px-4 py-2">
                        <div>
                          <p className="font-medium">
                            {isCustom ? (item.description || 'Custom Service') : product?.name}
                          </p>
                          {!isCustom && product && (
                            <p className="text-sm text-gray-600">{product.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-center">{item.quantity}</td>
                      <td className="border border-gray-200 px-4 py-2 text-right">
                        ${(item.customPrice || product?.price || 0).toLocaleString()}
                        {item.discount && (
                          <span className="text-sm text-green-600 block">
                            -{item.discount}% discount
                          </span>
                        )}
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-right font-medium">
                        ${calculateItemTotal(item).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium">Subtotal:</span>
                <span className="font-medium">${invoice.subtotal.toLocaleString()}</span>
              </div>
              {(invoice.tax ?? 0) > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium">Tax ({invoice.taxRate}%):</span>
                  <span className="font-medium">${(invoice.tax ?? 0).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-t-2 border-gray-900 font-bold text-lg">
                <span>Total:</span>
                <span>${invoice.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Notes:</h3>
              <p className="text-gray-700 text-sm whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Preview Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowPreview(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Edit Invoice
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700"
            >
              <Save className="mr-2 h-4 w-4 inline" />
              Save Draft
            </button>
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              <Send className="mr-2 h-4 w-4 inline" />
              Send Invoice
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Create {type.charAt(0).toUpperCase() + type.slice(1)} Invoice for {clientName}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowPreview(true)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Eye className="mr-2 h-4 w-4 inline" />
              Preview
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Invoice Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invoice Number
            </label>
            <input
              type="text"
              value={invoice.invoiceNumber}
              onChange={(e) => setInvoice(prev => ({ ...prev, invoiceNumber: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Date
            </label>
            <input
              type="date"
              value={invoice.issueDate}
              onChange={(e) => setInvoice(prev => ({ ...prev, issueDate: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <input
              type="date"
              value={invoice.dueDate}
              onChange={(e) => setInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invoice Title
            </label>
            <input
              type="text"
              value={invoice.title}
              onChange={(e) => setInvoice(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={invoice.taxRate || ''}
              onChange={(e) => setInvoice(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            rows={3}
            value={invoice.description}
            onChange={(e) => setInvoice(prev => ({ ...prev, description: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Items Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">Invoice Items</h4>
            <div className="flex space-x-2">
              <button
                onClick={addCustomItem}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200"
              >
                <Plus className="mr-1 h-3 w-3 inline" />
                Custom Item
              </button>
            </div>
          </div>

          {/* Predefined Services Quick Add */}
          {type !== 'custom' && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">Quick add {type} services:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {PRODUCT_CATALOG
                  .filter(product => 
                    (type === 'setup' && product.type === 'one-time') ||
                    (type === 'monthly' && product.type === 'recurring')
                  )
                  .map((product) => (
                    <button
                      key={product.id}
                      onClick={() => addItem(product)}
                      className="text-left p-2 border border-gray-200 rounded hover:bg-gray-50 text-sm"
                    >
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-gray-600">${product.price.toLocaleString()}</div>
                    </button>
                  ))
                }
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="space-y-4">
            {invoice.items.map((item, index) => {
              const product = PRODUCT_CATALOG.find(p => p.id === item.productId);
              const isCustom = item.productId.startsWith('custom-');

              return (
                <div key={item.productId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      {isCustom ? (
                        <input
                          type="text"
                          value={item.description || ''}
                          onChange={(e) => updateItem(item.productId, { description: e.target.value })}
                          placeholder="Service description"
                          className="font-medium text-gray-900 border-none p-0 focus:ring-0 bg-transparent"
                        />
                      ) : (
                        <div>
                          <h5 className="font-medium text-gray-900">{product?.name}</h5>
                          <p className="text-sm text-gray-600">{product?.description}</p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.productId, { quantity: parseInt(e.target.value) })}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Rate
                      </label>
                      <input
                        type="number"
                        value={item.customPrice || product?.price || 0}
                        onChange={(e) => updateItem(item.productId, { customPrice: parseFloat(e.target.value) })}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Discount %
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.discount || ''}
                        onChange={(e) => updateItem(item.productId, { discount: parseFloat(e.target.value) })}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="text-right">
                        <span className="text-xs font-medium text-gray-500">Amount</span>
                        <p className="text-lg font-bold text-gray-900">
                          ${calculateItemTotal(item).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {invoice.items.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>No items added yet. Add services or custom items above.</p>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes & Terms
          </label>
          <textarea
            rows={4}
            value={invoice.notes}
            onChange={(e) => setInvoice(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Payment terms, additional notes..."
          />
        </div>

        {/* Summary */}
        {invoice.items.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Invoice Summary</h4>
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span>Subtotal:</span>
                  <span>${invoice.subtotal.toLocaleString()}</span>
                </div>
                {(invoice.tax ?? 0) > 0 && (
                  <div className="flex justify-between py-2">
                    <span>Tax ({invoice.taxRate}%):</span>
                    <span>${(invoice.tax ?? 0).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-t border-gray-300 font-bold text-lg">
                  <span>Total:</span>
                  <span>${invoice.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700"
          >
            <Save className="mr-2 h-4 w-4 inline" />
            Save Draft
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            <Eye className="mr-2 h-4 w-4 inline" />
            Preview & Send
          </button>
        </div>
      </div>
    </div>
  );
} 