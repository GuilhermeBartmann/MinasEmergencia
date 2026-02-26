import { City } from '@/types/city';

export const CITIES: City[] = [
  {
    name: 'Juiz de Fora',
    slug: 'jf',
    state: 'MG',
    coordinates: { lat: -21.7642, lng: -43.3502 },
    bounds: {
      north: -21.5800,
      south: -21.9200,
      east: -43.1500,
      west: -43.5500
    },
    enabled: true,
    collectionName: 'jf_pontos',
    metadata: {
      description: 'Pontos de coleta e abrigos',
      emergencyPhone: '199'
    },
    seo: {
      title: 'Emergência JF - Pontos de Coleta e Abrigos',
      description: 'Mapa colaborativo de pontos de doação e abrigos para vítimas de enchentes em Juiz de Fora, MG',
      keywords: ['juiz de fora', 'jf', 'enchente', 'doações', 'abrigos', 'emergência', 'minas gerais']
    }
  },
  {
    name: 'Ubá',
    slug: 'uba',
    state: 'MG',
    coordinates: { lat: -21.1196, lng: -42.9428 },
    bounds: {
      north: -20.9600,
      south: -21.2800,
      east: -42.7800,
      west: -43.1000
    },
    enabled: true,
    collectionName: 'uba_pontos',
    metadata: {
      description: 'Pontos de coleta e abrigos',
      emergencyPhone: '199'
    },
    seo: {
      title: 'Emergência Ubá - Pontos de Coleta e Abrigos',
      description: 'Mapa colaborativo de pontos de doação e abrigos para vítimas de enchentes em Ubá, MG',
      keywords: ['ubá', 'uba', 'enchente', 'doações', 'abrigos', 'emergência', 'minas gerais']
    }
  },
  {
    name: 'Matias Barbosa',
    slug: 'matias-barbosa',
    state: 'MG',
    coordinates: { lat: -21.8694, lng: -43.3181 },
    bounds: {
      north: -21.7700,
      south: -21.9700,
      east: -43.2000,
      west: -43.4300
    },
    enabled: false, // Comentado temporariamente
    collectionName: 'matias_barbosa_pontos',
    metadata: {
      description: 'Pontos de coleta e abrigos',
      emergencyPhone: '199'
    },
    seo: {
      title: 'Emergência Matias Barbosa - Pontos de Coleta',
      description: 'Mapa colaborativo de pontos de doação e abrigos em Matias Barbosa, MG',
      keywords: ['matias barbosa', 'enchente', 'doações', 'abrigos', 'emergência', 'minas gerais']
    }
  }
];

export const getCityBySlug = (slug: string): City | undefined => {
  return CITIES.find(city => city.slug === slug && city.enabled);
};

export const getAllEnabledCities = (): City[] => {
  return CITIES.filter(city => city.enabled);
};
