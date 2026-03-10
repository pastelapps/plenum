'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import {
  BarChart2,
  BookOpen,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  type UserRole,
  hasMinRole,
  ROLE_LABELS,
  ROLE_COLORS,
} from '@/types/user-roles';

const NAV_ITEMS = [
  { label: 'Dashboard',     href: '/admin',               icon: BarChart2, minRole: 'consultor' as UserRole },
  { label: 'Cursos',        href: '/admin/cursos',         icon: BookOpen,  minRole: 'consultor' as UserRole },
  { label: 'Leads',         href: '/admin/leads',          icon: Users,     minRole: 'gerente'   as UserRole },
  { label: 'Configurações', href: '/admin/configuracoes',  icon: Settings,  minRole: 'admin'     as UserRole },
];

interface AdminShellProps {
  children: React.ReactNode;
  role?: UserRole;
}

export default function AdminShell({ children, role = 'dev' }: AdminShellProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  // Only show nav items the current role has access to
  const visibleItems = NAV_ITEMS.filter((item) => hasMinRole(role, item.minRole));

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r flex flex-col transition-transform duration-200 lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b shrink-0">
          <span className="font-bold text-lg text-gray-900">Plenum Admin</span>
          <button
            className="ml-auto lg:hidden text-gray-400 hover:text-gray-600"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {visibleItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </a>
          ))}
        </nav>

        {/* Role badge + Logout */}
        <div className="p-3 border-t shrink-0 space-y-2">
          <div className="px-3">
            <span className={cn(
              'inline-flex text-xs font-medium px-2.5 py-1 rounded-full',
              ROLE_COLORS[role]
            )}>
              {ROLE_LABELS[role]}
            </span>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-500 hover:text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b bg-white flex items-center px-4 lg:px-6 shrink-0">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1" />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
