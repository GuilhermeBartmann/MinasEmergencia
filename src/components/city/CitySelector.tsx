import { getAllEnabledCities } from '@/config/cities';
import { CityCard } from './CityCard';

export function CitySelector() {
  const cities = getAllEnabledCities();

  return (
    <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
      {cities.map((city) => (
        <CityCard key={city.slug} city={city} />
      ))}
    </div>
  );
}
