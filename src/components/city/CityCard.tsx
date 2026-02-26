import Link from 'next/link';
import { City } from '@/types/city';
import { Card } from '@/components/ui/Card';

export interface CityCardProps {
  city: City;
}

export function CityCard({ city }: CityCardProps) {
  return (
    <Link href={`/${city.slug}`} className="w-full max-w-sm">
      <Card
        hover
        className="h-full cursor-pointer group border-2 border-transparent hover:border-emergency-500"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-emergency-600 group-hover:text-emergency-700 transition-colors">
            {city.name}
          </h2>
          <span className="text-3xl">🗺️</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span>📍</span>
          <span>{city.state}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-emergency-600 font-semibold group-hover:text-emergency-700 transition-colors flex items-center gap-2">
            Ver pontos de coleta
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
