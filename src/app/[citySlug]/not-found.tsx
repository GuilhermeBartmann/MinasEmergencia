import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function CityNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emergency-600 to-emergency-500 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-black text-white mb-4">404</h1>
        <h2 className="text-3xl font-bold text-white mb-4">
          Cidade não encontrada
        </h2>
        <p className="text-xl text-white/90 mb-8">
          A cidade que você procura não está disponível no sistema.
        </p>
        <Link href="/">
          <Button variant="outline" size="lg" className="bg-white text-emergency-600 hover:bg-gray-100">
            ← Voltar para página inicial
          </Button>
        </Link>
      </div>
    </div>
  );
}
