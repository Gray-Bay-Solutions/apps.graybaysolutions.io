'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Minus, 
  FileText, 
  DollarSign, 
  Calendar, 
  Send, 
  Save,
  Eye,
  Check,
  X
} from 'lucide-react';
import { PRODUCT_CATALOG, Product, calculateTotal, getCoreServices, getMonthlyServices, getAddOns } from '@/lib/products';

interface QuoteItem {
  productId: string;
  quantity: number;
  customPrice?: number;
  discount?: number;
}

interface QuoteData {
  clientId: number;
  clientName: string;
  title: string;
  description: string;
  items: QuoteItem[];
  validUntil: string;
  notes: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
}

interface QuoteBuilderProps {
  clientId: number;
  clientName: string;
  onSave?: (quote: QuoteData) => void;
  onSend?: (quote: QuoteData) => void;
  initialQuote?: QuoteData;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function QuoteBuilder({ 
  clientId, 
  clientName, 
  onSave, 
  onSend, 
  initialQuote 
}: QuoteBuilderProps) {
  const [quote, setQuote] = useState<QuoteData>({
    clientId,
    clientName,
    title: `Proposal for ${clientName}`,
    description: 'Digital services proposal including setup and ongoing management.',
    items: [],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    notes: 'All setup services include training and 30-day support. Monthly services can be cancelled with 30-day notice.',
    status: 'draft'
  });

  const [selectedCategory, setSelectedCategory] = useState<'core' | 'monthly' | 'addon'>('core');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (initialQuote) {
      setQuote(initialQuote);
    }
  }, [initialQuote]);

  const addItem = (product: Product) => {
    const existingItemIndex = quote.items.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...quote.items];
      updatedItems[existingItemIndex].quantity += 1;
      setQuote(prev => ({ ...prev, items: updatedItems }));
    } else {
      setQuote(prev => ({
        ...prev,
        items: [...prev.items, { productId: product.id, quantity: 1 }]
      }));
    }
  };

  const removeItem = (productId: string) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.filter(item => item.productId !== productId)
    }));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setQuote(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    }));
  };

  const updateCustomPrice = (productId: string, customPrice: number) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.productId === productId ? { ...item, customPrice } : item
      )
    }));
  };

  const updateDiscount = (productId: string, discount: number) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.productId === productId ? { ...item, discount } : item
      )
    }));
  };

  const calculateItemTotal = (item: QuoteItem): number => {
    const product = PRODUCT_CATALOG.find(p => p.id === item.productId);
    if (!product) return 0;

    const basePrice = item.customPrice || product.price;
    const discountAmount = item.discount ? (basePrice * item.discount / 100) : 0;
    return (basePrice - discountAmount) * item.quantity;
  };

  const totals = {
    oneTime: quote.items
      .filter(item => {
        const product = PRODUCT_CATALOG.find(p => p.id === item.productId);
        return product?.type === 'one-time';
      })
      .reduce((sum, item) => sum + calculateItemTotal(item), 0),
    monthly: quote.items
      .filter(item => {
        const product = PRODUCT_CATALOG.find(p => p.id === item.productId);
        return product?.type === 'recurring';
      })
      .reduce((sum, item) => sum + calculateItemTotal(item), 0)
  };

  const currentProducts = selectedCategory === 'core' ? getCoreServices() :
                          selectedCategory === 'monthly' ? getMonthlyServices() :
                          getAddOns();

  const handleSave = () => {
    if (onSave) {
      onSave(quote);
    }
  };

  const handleSend = () => {
    const updatedQuote = { ...quote, status: 'sent' as const };
    setQuote(updatedQuote);
    if (onSend) {
      onSend(updatedQuote);
    }
  };

  if (showPreview) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Preview Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Quote Preview</h3>
            <button
              onClick={() => setShowPreview(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Quote Preview Content */}
        <div className="p-8 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">PROPOSAL</h1>
            <p className="text-gray-600">Graybay Digital Services</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
              <p className="text-gray-700">{clientName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Valid Until: {new Date(quote.validUntil).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{quote.title}</h2>
            <p className="text-gray-700">{quote.description}</p>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-200 px-4 py-2 text-left">Service</th>
                  <th className="border border-gray-200 px-4 py-2 text-center">Qty</th>
                  <th className="border border-gray-200 px-4 py-2 text-right">Price</th>
                  <th className="border border-gray-200 px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item) => {
                  const product = PRODUCT_CATALOG.find(p => p.id === item.productId);
                  if (!product) return null;

                  return (
                    <tr key={item.productId}>
                      <td className="border border-gray-200 px-4 py-2">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.description}</p>
                          {product.type === 'recurring' && (
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                              Monthly
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-center">{item.quantity}</td>
                      <td className="border border-gray-200 px-4 py-2 text-right">
                        ${(item.customPrice || product.price).toLocaleString()}
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
              {totals.oneTime > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium">Setup Total:</span>
                  <span className="font-medium">${totals.oneTime.toLocaleString()}</span>
                </div>
              )}
              {totals.monthly > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium">Monthly Total:</span>
                  <span className="font-medium">${totals.monthly.toLocaleString()}/month</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-t-2 border-gray-900 font-bold text-lg">
                <span>Total Due:</span>
                <span>${totals.oneTime.toLocaleString()}</span>
              </div>
              {totals.monthly > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  Plus ${totals.monthly.toLocaleString()}/month ongoing
                </p>
              )}
            </div>
          </div>

          {quote.notes && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Terms & Notes:</h3>
              <p className="text-gray-700 text-sm">{quote.notes}</p>
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
              Edit Quote
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
              Send Quote
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
          <h3 className="text-lg font-medium text-gray-900">Create Quote for {clientName}</h3>
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
        {/* Quote Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quote Title
            </label>
            <input
              type="text"
              value={quote.title}
              onChange={(e) => setQuote(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valid Until
            </label>
            <input
              type="date"
              value={quote.validUntil}
              onChange={(e) => setQuote(prev => ({ ...prev, validUntil: e.target.value }))}
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
            value={quote.description}
            onChange={(e) => setQuote(prev => ({ ...prev, description: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Product Selection */}
        <div className="mb-8">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Add Services</h4>
          
          {/* Category Tabs */}
          <div className="border-b border-gray-200 mb-6">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {currentProducts.map((product) => {
              const isAdded = quote.items.some(item => item.productId === product.id);
              
              return (
                <div
                  key={product.id}
                  className={classNames(
                    'border border-gray-200 rounded-lg p-4',
                    isAdded ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-gray-50'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{product.name}</h5>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price.toLocaleString()}
                      </span>
                      {product.type === 'recurring' && (
                        <span className="text-sm text-gray-500">/month</span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                  
                  {product.deliveryTime && (
                    <p className="text-xs text-gray-500 mb-3">
                      Delivery: {product.deliveryTime}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span
                      className={classNames(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        product.type === 'one-time'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      )}
                    >
                      {product.type === 'one-time' ? 'Setup Fee' : 'Monthly'}
                    </span>
                    
                    <button
                      onClick={() => isAdded ? removeItem(product.id) : addItem(product)}
                      className={classNames(
                        'px-3 py-1 rounded-md text-sm font-medium',
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

        {/* Selected Items */}
        {quote.items.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Selected Services</h4>
            <div className="space-y-4">
              {quote.items.map((item) => {
                const product = PRODUCT_CATALOG.find(p => p.id === item.productId);
                if (!product) return null;

                return (
                  <div key={item.productId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h5 className="font-medium text-gray-900">{product.name}</h5>
                        <p className="text-sm text-gray-600">{product.description}</p>
                      </div>
                      <button
                        onClick={() => removeItem(product.id)}
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
                          onChange={(e) => updateQuantity(product.id, parseInt(e.target.value))}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Custom Price
                        </label>
                        <input
                          type="number"
                          placeholder={product.price.toString()}
                          value={item.customPrice || ''}
                          onChange={(e) => updateCustomPrice(product.id, parseFloat(e.target.value))}
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
                          onChange={(e) => updateDiscount(product.id, parseFloat(e.target.value))}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      </div>
                      <div className="flex items-end">
                        <div className="text-right">
                          <span className="text-xs font-medium text-gray-500">Total</span>
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
          </div>
        )}

        {/* Notes */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Terms & Notes
          </label>
          <textarea
            rows={4}
            value={quote.notes}
            onChange={(e) => setQuote(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Payment terms, delivery timeline, additional notes..."
          />
        </div>

        {/* Summary */}
        {quote.items.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Quote Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {totals.oneTime > 0 && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">Setup Total</p>
                  <p className="text-3xl font-bold text-gray-900">${totals.oneTime.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">One-time payment</p>
                </div>
              )}
              {totals.monthly > 0 && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">Monthly Total</p>
                  <p className="text-3xl font-bold text-indigo-600">${totals.monthly.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Recurring monthly</p>
                </div>
              )}
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