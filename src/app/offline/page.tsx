'use client';

import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

/**
 * Offline fallback page
 * Shown when user is offline and tries to access a page not in cache
 */
export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emergency-600 to-emergency-500 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-2xl p-8 text-center">
          {/* Icon */}
          <div className="text-6xl mb-4">📡</div>

          {/* Title */}
          <h1 className="text-3xl font-black text-gray-900 mb-4">
            Você está offline
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            Não foi possível carregar esta página. Verifique sua conexão com a internet e tente novamente.
          </p>

          {/* Info Alert */}
          <Alert variant="info" className="text-left mb-6">
            <p className="text-sm font-semibold mb-2">Modo Offline Ativo</p>
            <ul className="text-xs space-y-1">
              <li>• Páginas visitadas recentemente estão em cache</li>
              <li>• Mapa pode estar parcialmente disponível</li>
              <li>• Cadastro de novos pontos requer conexão</li>
            </ul>
          </Alert>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => window.location.reload()}
            >
              Tentar Novamente
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.history.back()}
            >
              Voltar
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.href = '/'}
            >
              Ir para Página Inicial
            </Button>
          </div>

          {/* Emergency Contacts */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-3 font-semibold">
              Contatos de Emergência (funcionam offline):
            </p>
            <div className="flex justify-center gap-4 text-xs">
              <a href="tel:199" className="text-emergency-600 hover:text-emergency-700 font-medium">
                🚨 Defesa Civil: 199
              </a>
              <a href="tel:193" className="text-emergency-600 hover:text-emergency-700 font-medium">
                🚒 Bombeiros: 193
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
