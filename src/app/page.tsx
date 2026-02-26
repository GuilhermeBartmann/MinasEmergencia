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

            {/* Social Media Links */}
            <div className="flex justify-center gap-6 mt-6">
              <a
                href="https://www.linkedin.com/in/devguilhermebartmann"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
              <a
                href="https://instagram.com/guilhermebartmannjf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/>
                </svg>
                @guilhermebartmannjf
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
