import Link from 'next/link';

export function AdminSidebar() {
  return (
    <aside className="w-48 shrink-0 bg-gray-900 text-white min-h-full flex flex-col">
      <div className="px-4 py-5 border-b border-gray-700">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Admin
        </p>
        <p className="text-sm font-bold text-white mt-0.5">MinasEmergência</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <Link
          href="/administradores/pontos"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        >
          <span>📍</span>
          Pontos
        </Link>
      </nav>
    </aside>
  );
}
