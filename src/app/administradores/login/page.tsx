import { Metadata } from 'next';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export const metadata: Metadata = {
  title: 'Admin — Login',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Painel Admin</h1>
          <p className="text-sm text-gray-500 mt-1">MinasEmergência</p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
