import Link from 'next/link';

export interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export function Header({ title = 'Emergência Coletas', showBackButton = false }: HeaderProps) {
  return (
    <header className="bg-emergency-600 text-white shadow-lg sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Link
                href="/"
                className="p-2 hover:bg-emergency-700 rounded-lg transition-colors"
                aria-label="Voltar para página inicial"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            )}
            <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
          </div>

          {/* Emergency Phone */}
          <a
            href="tel:199"
            className="flex items-center gap-2 bg-emergency-700 hover:bg-emergency-800 px-3 py-2 rounded-lg transition-colors text-sm md:text-base"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="hidden sm:inline font-semibold">Emergência: 199</span>
            <span className="sm:hidden font-semibold">199</span>
          </a>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-emergency-700 text-white py-2 px-4 text-center text-xs md:text-sm animate-pulse-warning">
        <p className="font-semibold">
          ⚠️ ATENÇÃO: Verifique sempre a autenticidade dos pontos de coleta. Cuidado com golpes!
        </p>
      </div>
    </header>
  );
}
