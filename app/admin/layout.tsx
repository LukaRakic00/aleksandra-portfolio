'use client';

import { usePathname } from 'next/navigation';
import AdminLayoutComponent from '@/components/AdminLayout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Don't wrap login page with AdminLayout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  return <AdminLayoutComponent>{children}</AdminLayoutComponent>;
}

