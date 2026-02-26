import { CitySelector } from '@/components/city/CitySelector';
import { Alert } from '@/components/ui/Alert';
import { WebSiteStructuredData, OrganizationStructuredData } from '@/components/seo/StructuredData';
import { HelpLinksSection } from '@/components/home/HelpLinksSection';

export default function Home() {
  return (
    <>
      {/* SEO Structured Data */}
      <WebSiteStructuredData />
      <OrganizationStructuredData />

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-emergency-600 to-emergency-500">
      {/* Warning Banner */}
      <div className="bg-emergency-700 text-white py-3 px-4 text-center animate-pulse-warning">
        <p className="text-sm font-semibold">
          ⚠️ ATENÇÃO: Cuidado com golpes! Verifique sempre a autenticidade dos pontos de coleta.
        </p>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
            Emergência Coletas
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-semibold mb-2">
            Pontos de Doação e Abrigos para Emergências
          </p>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Sistema colaborativo para localizar pontos de doação e abrigos durante
            emergências em Minas Gerais
          </p>
        </div>

        {/* City Selection */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
            Selecione sua cidade
          </h2>
          <CitySelector />
        </div>

        {/* Help Links Card */}
        <HelpLinksSection />

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
            <div className="text-3xl mb-3">🗺️</div>
            <h3 className="text-lg font-bold mb-2">Mapa Interativo</h3>
            <p className="text-sm text-white/80">
              Visualize todos os pontos de coleta e abrigos em tempo real no mapa
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="text-lg font-bold mb-2">Cadastro Rápido</h3>
            <p className="text-sm text-white/80">
              Adicione novos pontos de forma simples e rápida para ajudar a comunidade
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="text-lg font-bold mb-2">Atualizações em Tempo Real</h3>
            <p className="text-sm text-white/80">
              Informações sempre atualizadas com novos pontos aparecendo automaticamente
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-400 space-y-2">
            <p>
              Sistema colaborativo para ajudar vítimas de emergências
            </p>
            <p>
              Desenvolvido com Next.js 15 + Firebase + Leaflet
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <a href="tel:199" className="hover:text-white transition-colors">
                🚨 Defesa Civil: 199
              </a>
              <span>•</span>
              <a href="tel:193" className="hover:text-white transition-colors">
                🚒 Bombeiros: 193
              </a>
            </div>
            <p className="mt-4">
              © {new Date().getFullYear()} Emergência Coletas • LGPD Compliant
            </p>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
