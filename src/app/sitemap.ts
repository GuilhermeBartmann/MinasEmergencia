import { MetadataRoute } from 'next';
import { getAllEnabledCities } from '@/config/cities';

/**
 * Dynamic sitemap generation
 * Automatically includes all enabled cities
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://emergenciacoletas.vercel.app';
  const cities = getAllEnabledCities();

  // Landing page
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // City pages
  cities.forEach((city) => {
    routes.push({
      url: `${baseUrl}/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: 'hourly', // Changes frequently due to real-time updates
      priority: 0.9,
    });
  });

  return routes;
}
