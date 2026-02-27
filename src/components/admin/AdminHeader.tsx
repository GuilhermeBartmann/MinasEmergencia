'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function AdminHeader() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/administradores/login');
    router.refresh();
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-base font-semibold text-gray-800">
        Painel de Administração
      </h1>
      <Button variant="secondary" size="sm" onClick={handleLogout}>
        Sair
      </Button>
    </header>
  );
}
