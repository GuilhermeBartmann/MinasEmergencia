'use client';

export function MapLegend() {
  return (
    <div className="absolute bottom-6 left-6 z-[1000] bg-white rounded-lg shadow-lg p-4 max-w-xs">
      <h3 className="font-bold text-sm mb-3 text-gray-900">Legenda do Mapa</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex-shrink-0">
            <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow"></div>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-900">Ponto de Coleta</p>
            <p className="text-xs text-gray-600">Aceita doações</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex-shrink-0">
            <div className="w-4 h-4 rounded-full bg-yellow-600 border-2 border-white shadow"></div>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-900">Abrigo</p>
            <p className="text-xs text-gray-600">Acolhe pessoas</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex-shrink-0">
            <div className="w-4 h-4 rounded-full bg-green-600 border-2 border-white shadow"></div>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-900">Localização Selecionada</p>
            <p className="text-xs text-gray-600">Modo seleção de ponto</p>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          💡 Clique nos marcadores para ver detalhes
        </p>
      </div>
    </div>
  );
}
