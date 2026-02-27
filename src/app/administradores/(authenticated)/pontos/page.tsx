import { Metadata } from 'next';
import { AdminPointsTable } from '@/components/admin/AdminPointsTable';

export const metadata: Metadata = {
  title: 'Pontos — Admin',
  robots: { index: false, follow: false },
};

export default function AdminPontosPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Pontos de Coleta e Abrigos</h2>
      <AdminPointsTable />
    </div>
  );
}
