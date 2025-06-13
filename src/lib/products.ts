// Product catalog based on services.md
export interface Product {
  id: string;
  name: string;
  category: 'core' | 'monthly' | 'addon';
  type: 'one-time' | 'recurring';
  price: number;
  description: string;
  deliveryTime?: string;
  features?: string[];
}

export const PRODUCT_CATALOG: Product[] = [
  // Core Services - One-time setup fees
  {
    id: 'website-template',
    name: 'Template Website',
    category: 'core',
    type: 'one-time',
    price: 1500,
    description: 'Industry-specific website template with CMS backend',
    deliveryTime: '2-3 weeks',
    features: [
      'Pre-built pages (Home, About, Services, Contact)',
      'Industry-specific content placeholders',
      'Built-in contact forms',
      'Google Analytics integration',
      'Basic SEO setup',
      'Mobile responsive design'
    ]
  },
  {
    id: 'chatbot-setup',
    name: 'AI Chatbot Setup',
    category: 'core',
    type: 'one-time',
    price: 800,
    description: 'Pre-configured business chatbot with FAQ database',
    deliveryTime: '1-2 weeks',
    features: [
      'Business-type chatbot template',
      'Standard FAQ database',
      'Lead capture flows',
      'Appointment booking integration',
      'Handoff-to-human protocols'
    ]
  },
  {
    id: 'local-seo-setup',
    name: 'Local SEO Setup',
    category: 'core',
    type: 'one-time',
    price: 1000,
    description: 'Complete local SEO optimization and setup',
    deliveryTime: '2-3 weeks',
    features: [
      'Google My Business optimization',
      'Local citation submissions',
      'Review management system setup',
      'Local content optimization',
      'Monthly reporting dashboard'
    ]
  },
  {
    id: 'analytics-dashboard',
    name: 'Business Analytics Dashboard',
    category: 'core',
    type: 'one-time',
    price: 600,
    description: 'Custom analytics dashboard with business metrics',
    deliveryTime: '1-2 weeks',
    features: [
      'Google Analytics integration',
      'Social media monitoring',
      'Lead tracking system',
      'ROI reporting templates',
      'Automated report generation'
    ]
  },
  {
    id: 'email-automation',
    name: 'Email Automation Setup',
    category: 'core',
    type: 'one-time',
    price: 500,
    description: 'Automated email workflows and sequences',
    deliveryTime: '1 week',
    features: [
      'Email welcome sequences',
      'Appointment reminder systems',
      'Follow-up automation templates',
      'Lead nurturing workflows',
      'Performance tracking'
    ]
  },

  // Monthly Services - Recurring fees
  {
    id: 'website-maintenance',
    name: 'Website Maintenance',
    category: 'monthly',
    type: 'recurring',
    price: 99,
    description: 'Monthly website updates, hosting, and maintenance',
    features: [
      'Hosting and security updates',
      'Content updates',
      'Performance monitoring',
      'Backup management',
      'Technical support'
    ]
  },
  {
    id: 'chatbot-management',
    name: 'Chatbot Management',
    category: 'monthly',
    type: 'recurring',
    price: 100,
    description: 'Monthly chatbot optimization and management',
    features: [
      'Performance monitoring',
      'Response optimization',
      'FAQ updates',
      'Analytics reporting',
      'Technical support'
    ]
  },
  {
    id: 'seo-management',
    name: 'SEO Management',
    category: 'monthly',
    type: 'recurring',
    price: 300,
    description: 'Ongoing SEO optimization and reporting',
    features: [
      'Monthly optimization',
      'Performance reports',
      'Keyword monitoring',
      'Competitor analysis',
      'Strategy adjustments'
    ]
  },
  {
    id: 'dashboard-reports',
    name: 'Dashboard & Reports',
    category: 'monthly',
    type: 'recurring',
    price: 200,
    description: 'Monthly analytics reports and dashboard management',
    features: [
      'Custom report generation',
      'Performance analysis',
      'Dashboard maintenance',
      'Data visualization',
      'Strategic insights'
    ]
  },
  {
    id: 'automation-management',
    name: 'Automation Management',
    category: 'monthly',
    type: 'recurring',
    price: 150,
    description: 'Monthly automation workflow optimization',
    features: [
      'Workflow optimization',
      'Performance monitoring',
      'Sequence updates',
      'A/B testing',
      'Reporting and analytics'
    ]
  },

  // Add-ons - One-time or recurring
  {
    id: 'ecommerce-integration',
    name: 'E-commerce Integration',
    category: 'addon',
    type: 'one-time',
    price: 800,
    description: 'Shopify/WooCommerce integration for online sales',
    deliveryTime: '1-2 weeks',
    features: [
      'Online store setup',
      'Payment processing',
      'Product catalog',
      'Order management',
      'Inventory tracking'
    ]
  },
  {
    id: 'custom-design',
    name: 'Custom Design',
    category: 'addon',
    type: 'one-time',
    price: 500,
    description: 'Custom design elements beyond template',
    deliveryTime: '1 week',
    features: [
      'Custom graphics',
      'Brand-specific design',
      'Layout modifications',
      'Color scheme customization',
      'Typography selection'
    ]
  },
  {
    id: 'phone-integration',
    name: 'Phone Integration',
    category: 'addon',
    type: 'one-time',
    price: 500,
    description: 'Phone system integration for chatbots',
    deliveryTime: '1 week',
    features: [
      'Phone number setup',
      'Call routing',
      'Voice integration',
      'SMS capabilities',
      'Call analytics'
    ]
  },
  {
    id: 'review-management',
    name: 'Review Management',
    category: 'addon',
    type: 'recurring',
    price: 200,
    description: 'Monthly review monitoring and management',
    features: [
      'Review monitoring',
      'Response management',
      'Reputation tracking',
      'Review solicitation',
      'Reporting and insights'
    ]
  }
];

export const getProductById = (id: string): Product | undefined => {
  return PRODUCT_CATALOG.find(product => product.id === id);
};

export const getProductsByCategory = (category: Product['category']): Product[] => {
  return PRODUCT_CATALOG.filter(product => product.category === category);
};

export const getCoreServices = (): Product[] => {
  return getProductsByCategory('core');
};

export const getMonthlyServices = (): Product[] => {
  return getProductsByCategory('monthly');
};

export const getAddOns = (): Product[] => {
  return getProductsByCategory('addon');
};

export const calculateTotal = (productIds: string[]): { oneTime: number; monthly: number } => {
  let oneTime = 0;
  let monthly = 0;

  productIds.forEach(id => {
    const product = getProductById(id);
    if (product) {
      if (product.type === 'one-time') {
        oneTime += product.price;
      } else {
        monthly += product.price;
      }
    }
  });

  return { oneTime, monthly };
}; 