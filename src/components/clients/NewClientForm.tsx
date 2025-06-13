'use client';

import { useState } from 'react';
import { 
  Building2, 
  Users, 
  Mail, 
  Phone, 
  Globe, 
  ChevronRight, 
  ChevronLeft,
  Network,
  DollarSign,
  FileText,
  Download
} from 'lucide-react';
import { generateQuote } from '@/utils/generateQuote';

interface ClientFormData {
  companyInfo: {
    name: string;
    website: string;
    industry: string;
    size: string;
  };
  contacts: {
    primary: {
      name: string;
      role: string;
      email: string;
      phone: string;
    };
    technical: {
      name: string;
      role: string;
      email: string;
      phone: string;
    };
  };
  selectedServices: Array<{
    id: string;
    name: string;
    basePrice: number;
    customPrice: number;
    description: string;
    included: boolean;
  }>;
}

const availableServices = [
  {
    id: 'website',
    name: 'Website Hosting',
    basePrice: 299,
    description: 'High-performance website hosting with CDN and SSL',
    priceRange: { min: 199, max: 599 }
  },
  {
    id: 'chatbot',
    name: 'AI Chatbot',
    basePrice: 399,
    description: 'AI-powered customer service chatbot with custom training',
    priceRange: { min: 299, max: 799 }
  },
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    basePrice: 499,
    description: 'Real-time analytics and business intelligence dashboard',
    priceRange: { min: 399, max: 999 }
  },
  {
    id: 'api',
    name: 'API Gateway',
    basePrice: 599,
    description: 'Secure API gateway with rate limiting and monitoring',
    priceRange: { min: 499, max: 1299 }
  }
];

const initialFormData: ClientFormData = {
  companyInfo: {
    name: '',
    website: '',
    industry: '',
    size: '',
  },
  contacts: {
    primary: {
      name: '',
      role: '',
      email: '',
      phone: '',
    },
    technical: {
      name: '',
      role: '',
      email: '',
      phone: '',
    },
  },
  selectedServices: availableServices.map(service => ({
    ...service,
    customPrice: service.basePrice,
    included: false
  }))
};

export default function NewClientForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (section: string, subsection: string | null, field: string, value: string | number) => {
    setFormData(prev => {
      if (subsection) {
        return {
          ...prev,
          [section]: {
            ...prev[section as keyof ClientFormData],
            [subsection]: {
              ...(prev[section as keyof ClientFormData] as any)[subsection],
              [field]: value
            }
          }
        };
      }
      return {
        ...prev,
        [section]: {
          ...prev[section as keyof ClientFormData],
          [field]: value
        }
      };
    });
  };

  const toggleService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.map(service => 
        service.id === serviceId 
          ? { ...service, included: !service.included }
          : service
      )
    }));
  };

  const updateServicePrice = (serviceId: string, price: number) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.map(service => 
        service.id === serviceId 
          ? { ...service, customPrice: price }
          : service
      )
    }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleGenerateQuote = () => {
    generateQuote(formData);
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      // Here we would typically:
      // 1. Save the client data to the database
      // 2. Create service allocations
      // 3. Set up monitoring
      console.log('Creating new client:', formData);
      
      // For now, we'll just simulate a delay
      // await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await fetch('/api/clients', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to create client');
      }
      
      // Redirect to the clients list
      window.location.href = '/clients';
    } catch (error) {
      console.error('Error creating client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
      <div className="px-4 py-6 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            {step === 1 && 'Company Information'}
            {step === 2 && 'Contact Information'}
            {step === 3 && 'Service Selection'}
            {step === 4 && 'Quote Review'}
          </h2>
          <div className="flex items-center text-sm text-gray-500">
            Step {step} of 4
          </div>
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label htmlFor="company-name" className="block text-sm font-medium leading-6 text-gray-900">
                Company Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="company-name"
                  id="company-name"
                  value={formData.companyInfo.name}
                  onChange={(e) => updateFormData('companyInfo', null, 'name', e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="website" className="block text-sm font-medium leading-6 text-gray-900">
                Website
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="website"
                  id="website"
                  value={formData.companyInfo.website}
                  onChange={(e) => updateFormData('companyInfo', null, 'website', e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="industry" className="block text-sm font-medium leading-6 text-gray-900">
                Industry
              </label>
              <div className="mt-2">
                <select
                  id="industry"
                  name="industry"
                  value={formData.companyInfo.industry}
                  onChange={(e) => updateFormData('companyInfo', null, 'industry', e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="">Select industry</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="size" className="block text-sm font-medium leading-6 text-gray-900">
                Company Size
              </label>
              <div className="mt-2">
                <select
                  id="size"
                  name="size"
                  value={formData.companyInfo.size}
                  onChange={(e) => updateFormData('companyInfo', null, 'size', e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501+">501+ employees</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <h3 className="text-sm font-medium leading-6 text-gray-900 mb-4">Primary Contact</h3>
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="primary-name" className="block text-sm font-medium leading-6 text-gray-900">
                    Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="primary-name"
                      id="primary-name"
                      value={formData.contacts.primary.name}
                      onChange={(e) => updateFormData('contacts', 'primary', 'name', e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="primary-role" className="block text-sm font-medium leading-6 text-gray-900">
                    Role
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="primary-role"
                      id="primary-role"
                      value={formData.contacts.primary.role}
                      onChange={(e) => updateFormData('contacts', 'primary', 'role', e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="primary-email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      name="primary-email"
                      id="primary-email"
                      value={formData.contacts.primary.email}
                      onChange={(e) => updateFormData('contacts', 'primary', 'email', e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="primary-phone" className="block text-sm font-medium leading-6 text-gray-900">
                    Phone
                  </label>
                  <div className="mt-2">
                    <input
                      type="tel"
                      name="primary-phone"
                      id="primary-phone"
                      value={formData.contacts.primary.phone}
                      onChange={(e) => updateFormData('contacts', 'primary', 'phone', e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <h3 className="text-sm font-medium leading-6 text-gray-900 mb-4">Technical Contact</h3>
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="technical-name" className="block text-sm font-medium leading-6 text-gray-900">
                    Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="technical-name"
                      id="technical-name"
                      value={formData.contacts.technical.name}
                      onChange={(e) => updateFormData('contacts', 'technical', 'name', e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="technical-role" className="block text-sm font-medium leading-6 text-gray-900">
                    Role
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="technical-role"
                      id="technical-role"
                      value={formData.contacts.technical.role}
                      onChange={(e) => updateFormData('contacts', 'technical', 'role', e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="technical-email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      name="technical-email"
                      id="technical-email"
                      value={formData.contacts.technical.email}
                      onChange={(e) => updateFormData('contacts', 'technical', 'email', e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="technical-phone" className="block text-sm font-medium leading-6 text-gray-900">
                    Phone
                  </label>
                  <div className="mt-2">
                    <input
                      type="tel"
                      name="technical-phone"
                      id="technical-phone"
                      value={formData.contacts.technical.phone}
                      onChange={(e) => updateFormData('contacts', 'technical', 'phone', e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            {formData.selectedServices.map((service) => {
              const originalService = availableServices.find(s => s.id === service.id)!;
              return (
                <div key={service.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={service.included}
                          onChange={() => toggleService(service.id)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label htmlFor={service.id} className="ml-3 text-sm font-medium text-gray-900">
                          {service.name}
                        </label>
                      </div>
                      {service.included && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            ${originalService.priceRange.min} - ${originalService.priceRange.max}
                          </span>
                          <input
                            type="number"
                            value={service.customPrice}
                            onChange={(e) => updateServicePrice(service.id, Number(e.target.value))}
                            min={originalService.priceRange.min}
                            max={originalService.priceRange.max}
                            className="block w-24 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500 ml-7">{service.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="text-base font-semibold leading-7 text-gray-900">Company Information</h3>
              <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Company Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formData.companyInfo.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Website</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formData.companyInfo.website}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Industry</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formData.companyInfo.industry}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Size</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formData.companyInfo.size}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="text-base font-semibold leading-7 text-gray-900">Selected Services</h3>
              <ul className="mt-4 divide-y divide-gray-100">
                {formData.selectedServices
                  .filter(service => service.included)
                  .map(service => (
                    <li key={service.id} className="flex items-center justify-between py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-500">{service.description}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">${service.customPrice}/mo</p>
                    </li>
                  ))}
              </ul>
              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-6">
                <p className="text-base font-medium text-gray-900">Total Monthly Cost</p>
                <p className="text-base font-medium text-gray-900">
                  ${formData.selectedServices
                    .filter(service => service.included)
                    .reduce((sum, service) => sum + service.customPrice, 0)
                    }/mo
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-4 sm:px-8">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 1}
          className={`inline-flex items-center px-3 py-2 text-sm font-semibold rounded-md ${
            step === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-900 hover:bg-gray-50'
          }`}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </button>

        <div className="flex space-x-3">
          {step === 4 && (
            <>
              <button
                type="button"
                onClick={handleGenerateQuote}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Generate Quote
              </button>
              <button
                type="button"
                onClick={handleComplete}
                disabled={isSubmitting}
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    Complete Setup
                  </>
                )}
              </button>
            </>
          )}
          
          {step !== 4 && (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm bg-indigo-600 text-white hover:bg-indigo-500"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 