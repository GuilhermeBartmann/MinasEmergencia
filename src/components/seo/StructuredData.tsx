/**
 * JSON-LD Structured Data for SEO
 * Helps search engines understand the content
 */
export interface StructuredDataProps {
  type: 'WebSite' | 'WebPage' | 'Organization' | 'LocalBusiness';
  data: Record<string, any>;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * Structured data for landing page
 */
export function WebSiteStructuredData() {
  return (
    <StructuredData
      type="WebSite"
      data={{
        name: 'Emergência Coletas',
        description:
          'Sistema colaborativo para localizar pontos de doação e abrigos durante emergências em Minas Gerais',
        url: typeof window !== 'undefined' ? window.location.origin : '',
        inLanguage: 'pt-BR',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${typeof window !== 'undefined' ? window.location.origin : ''}/{citySlug}`,
          },
          'query-input': 'required name=citySlug',
        },
      }}
    />
  );
}

/**
 * Structured data for organization
 */
export function OrganizationStructuredData() {
  return (
    <StructuredData
      type="Organization"
      data={{
        name: 'Emergência Coletas',
        description: 'Sistema de ajuda humanitária para emergências',
        url: typeof window !== 'undefined' ? window.location.origin : '',
        logo: `${typeof window !== 'undefined' ? window.location.origin : ''}/icon-512.png`,
        sameAs: [],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '199',
            contactType: 'Defesa Civil',
            areaServed: 'BR',
            availableLanguage: 'Portuguese',
          },
          {
            '@type': 'ContactPoint',
            telephone: '193',
            contactType: 'Bombeiros',
            areaServed: 'BR',
            availableLanguage: 'Portuguese',
          },
        ],
      }}
    />
  );
}

/**
 * Structured data for city page
 */
export function CityPageStructuredData({
  cityName,
  citySlug,
  description,
  lat,
  lng,
}: {
  cityName: string;
  citySlug: string;
  description: string;
  lat: number;
  lng: number;
}) {
  return (
    <StructuredData
      type="WebPage"
      data={{
        name: `Emergência ${cityName} - Pontos de Coleta e Abrigos`,
        description,
        url: `${typeof window !== 'undefined' ? window.location.origin : ''}/${citySlug}`,
        inLanguage: 'pt-BR',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Emergência Coletas',
          url: typeof window !== 'undefined' ? window.location.origin : '',
        },
        about: {
          '@type': 'Place',
          name: cityName,
          geo: {
            '@type': 'GeoCoordinates',
            latitude: lat,
            longitude: lng,
          },
          address: {
            '@type': 'PostalAddress',
            addressRegion: 'MG',
            addressCountry: 'BR',
          },
        },
      }}
    />
  );
}
