'use client';

import Link from 'next/link';
import { Bell, Search, Settings, User, LogOut, HelpCircle, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const notifications = [
  {
    id: 1,
    type: 'alert',
    message: 'Analytics service response time above threshold',
    time: '1h ago',
    status: 'warning'
  },
  {
    id: 2,
    type: 'deployment',
    message: 'Successfully deployed Website Update to Acme Corp',
    time: '2h ago',
    status: 'success'
  },
  {
    id: 3,
    type: 'security',
    message: 'Security scan completed for all services',
    time: '3h ago',
    status: 'success'
  },
  {
    id: 4,
    type: 'cost',
    message: 'Monthly infrastructure cost report available',
    time: '5h ago',
    status: 'info'
  }
];

const userNavigation = [
  { name: 'Your Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Security', href: '/security', icon: Shield },
  { name: 'Help', href: '/help', icon: HelpCircle },
  { name: 'Sign out', href: '/logout', icon: LogOut }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function TopNav() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const getNotificationIcon = (status: string) => {
    switch (status) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      default:
        return <Bell className="h-5 w-5 text-blue-400" />;
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-xl font-semibold text-gray-900">
                GrayBay
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <form onSubmit={handleSearch} className="flex-shrink-0">
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Search services, clients..."
                />
              </div>
            </form>
            
            {/* Notifications */}
            <div className="relative ml-6">
              <button
                type="button"
                className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  4
                </span>
                <Bell className="h-6 w-6" />
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 z-10 mt-2 w-96 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            {getNotificationIcon(notification.status)}
                          </div>
                          <div className="ml-3 w-0 flex-1">
                            <p className="text-sm text-gray-900">{notification.message}</p>
                            <p className="mt-1 text-sm text-gray-500">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 px-4 py-2">
                    <a href="/notifications" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      View all notifications
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile dropdown */}
            <div className="relative ml-6">
              <button
                type="button"
                className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Gray Crozier</p>
                    <p className="text-sm text-gray-500">gray@graybay.com</p>
                  </div>
                  {userNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Icon className="mr-3 h-4 w-4 text-gray-400" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 