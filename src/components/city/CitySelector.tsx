import { getAllEnabledCities } from '@/config/cities';
import { CityCard } from './CityCard';

export function CitySelector() {
  const cities = getAllEnabledCities();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {cities.map((city) => (
        <CityCard key={city.slug} city={city} />
      ))}
    </div>
  );
}
