'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CreditCard, 
  MessagesSquare,
  Settings,
  Network
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Services', href: '/services', icon: Network },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Templates', href: '/templates', icon: FileText },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Support', href: '/support', icon: MessagesSquare },
  { name: 'Settings', href: '/settings', icon: Settings },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
      <div className="h-full flex flex-col">
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = item.href === '/' 
              ? pathname === '/'
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                )}
              >
                <Icon
                  className={classNames(
                    isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 h-5 w-5 flex-shrink-0'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
} 