export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-3">Sobre o Projeto</h3>
            <p className="text-gray-400 text-sm">
              Sistema colaborativo para ajudar vítimas de emergências a encontrar
              pontos de doação e abrigos em Minas Gerais.
            </p>
          </div>

          {/* Emergency Contacts */}
          <div>
            <h3 className="text-lg font-bold mb-3">Contatos de Emergência</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-gray-400">
                <span>🚨</span>
                <span>Defesa Civil: <a href="tel:199" className="hover:text-white">199</a></span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <span>🚒</span>
                <span>Bombeiros: <a href="tel:193" className="hover:text-white">193</a></span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <span>🚔</span>
                <span>Polícia: <a href="tel:190" className="hover:text-white">190</a></span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <span>🏥</span>
                <span>SAMU: <a href="tel:192" className="hover:text-white">192</a></span>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-lg font-bold mb-3">Tecnologias</h3>
            <p className="text-gray-400 text-sm mb-2">
              Desenvolvido com:
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-800 px-2 py-1 rounded text-xs">Next.js 15</span>
              <span className="bg-gray-800 px-2 py-1 rounded text-xs">TypeScript</span>
              <span className="bg-gray-800 px-2 py-1 rounded text-xs">Firebase</span>
              <span className="bg-gray-800 px-2 py-1 rounded text-xs">Leaflet</span>
              <span className="bg-gray-800 px-2 py-1 rounded text-xs">Tailwind</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} Emergência Coletas. Sistema de código aberto
            para ajuda humanitária.
          </p>
          <p className="mt-1">
            Dados colaborativos • LGPD Compliant • Sem cookies de rastreamento
          </p>
        </div>
      </div>
    </footer>
  );
}
