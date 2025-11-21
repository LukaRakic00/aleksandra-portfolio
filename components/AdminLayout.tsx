'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FolderKanban, User, Mail, LogOut, Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include', // Important: include cookies
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
      } else {
        // If not authenticated, redirect to login
        if (data.error === 'Not authenticated' || data.error === 'Invalid token') {
          router.push('/admin/login');
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      // On error, redirect to login
      router.push('/admin/login');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { href: '/admin/about', label: 'About', icon: User },
    { href: '/admin/contacts', label: 'Contacts', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Sidebar */}
        <aside
          className={`w-64 sm:w-72 bg-gray-900 text-white h-screen fixed left-0 top-0 z-40 transform transition-transform duration-300 ease-in-out flex flex-col ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-800 flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">Admin Panel</h1>
            {user && (
              <p className="text-xs sm:text-sm text-gray-400 truncate">{user.email || user.name}</p>
            )}
          </div>
          
          {/* Navigation - Scrollable */}
          <nav className="flex-1 overflow-y-auto mt-4 sm:mt-8 pb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-4 sm:px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
                    isActive ? 'bg-gray-800 text-white border-r-4 border-blue-500' : ''
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          
          {/* Footer - Always Visible */}
          <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-800 space-y-2 bg-gray-900">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center px-4 sm:px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors rounded-lg text-sm sm:text-base"
            >
              <span>Back to Site</span>
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center px-4 sm:px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors rounded-lg text-sm sm:text-base"
            >
              <LogOut className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

