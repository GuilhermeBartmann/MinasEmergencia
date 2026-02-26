import { notFound } from 'next/navigation';
import { getCityBySlug } from '@/config/cities';
import { CityMapPage } from './CityMapPage';

export async function generateMetadata({ params }: { params: Promise<{ citySlug: string }> }) {
  const { citySlug } = await params;
  const city = getCityBySlug(citySlug);

  if (!city) {
    return {
      title: 'Cidade não encontrada',
    };
  }

  return {
    title: city.seo.title,
    description: city.seo.description,
    keywords: city.seo.keywords,
    openGraph: {
      title: city.seo.title,
      description: city.seo.description,
      type: 'website',
      locale: 'pt_BR',
    },
  };
}

export default async function CityPage({ params }: { params: Promise<{ citySlug: string }> }) {
  const { citySlug } = await params;
  const city = getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  return <CityMapPage city={city} />;
}
