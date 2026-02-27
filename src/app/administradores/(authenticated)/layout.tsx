import { Metadata } from 'next';
import { ReactNode } from 'react';
import { getAdminSession } from '@/lib/admin/session';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export const metadata: Metadata = {
  title: 'Admin — MinasEmergência',
  robots: { index: false, follow: false },
};

export default async function AdminAuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Redirects to /administradores/login if session is invalid
  await getAdminSession();

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
