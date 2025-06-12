import { 
  Bell, 
  Shield, 
  Mail, 
  Globe, 
  Database, 
  Server,
  Users,
  CreditCard
} from 'lucide-react';

const settingSections = [
  {
    id: 'general',
    name: 'General Settings',
    description: 'Manage your general system preferences.',
    settings: [
      {
        id: 'notifications',
        name: 'Notifications',
        description: 'Configure system notification preferences',
        icon: Bell,
        current: true,
      },
      {
        id: 'security',
        name: 'Security',
        description: 'Manage security settings and access controls',
        icon: Shield,
        current: false,
      },
      {
        id: 'email',
        name: 'Email Settings',
        description: 'Configure email templates and delivery settings',
        icon: Mail,
        current: false,
      },
    ],
  },
  {
    id: 'services',
    name: 'Service Configuration',
    description: 'Configure service-specific settings.',
    settings: [
      {
        id: 'websites',
        name: 'Website Settings',
        description: 'Configure website deployment and hosting settings',
        icon: Globe,
        current: false,
      },
      {
        id: 'database',
        name: 'Database Settings',
        description: 'Manage database connections and backups',
        icon: Database,
        current: false,
      },
      {
        id: 'infrastructure',
        name: 'Infrastructure',
        description: 'Configure server and infrastructure settings',
        icon: Server,
        current: false,
      },
    ],
  },
  {
    id: 'business',
    name: 'Business Settings',
    description: 'Manage business-related configurations.',
    settings: [
      {
        id: 'clients',
        name: 'Client Settings',
        description: 'Configure client-related preferences and defaults',
        icon: Users,
        current: false,
      },
      {
        id: 'billing',
        name: 'Billing Settings',
        description: 'Manage billing configurations and payment settings',
        icon: CreditCard,
        current: false,
      },
    ],
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function SettingsPage() {
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
            <p className="mt-2 text-sm text-gray-700">
              Configure system-wide settings and preferences.
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          {settingSections.map((section) => (
            <div key={section.id} className="overflow-hidden bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">{section.name}</h2>
                <p className="mt-1 text-sm text-gray-500">{section.description}</p>
              </div>
              <div className="border-t border-gray-200">
                <div className="divide-y divide-gray-200">
                  {section.settings.map((setting) => (
                    <div
                      key={setting.id}
                      className={classNames(
                        setting.current ? 'bg-gray-50' : 'hover:bg-gray-50',
                        'cursor-pointer'
                      )}
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="rounded-md bg-indigo-50 p-3">
                                <setting.icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">{setting.name}</p>
                              <p className="text-sm text-gray-500">{setting.description}</p>
                            </div>
                          </div>
                          <div>
                            <svg
                              className="h-5 w-5 text-gray-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 