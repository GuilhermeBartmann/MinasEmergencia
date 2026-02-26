export interface CityCoordinates {
  lat: number;
  lng: number;
}

export interface CityBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface CityMetadata {
  population?: number;
  description: string;
  emergencyPhone?: string;
  lastUpdated?: Date;
}

export interface CitySEO {
  title: string;
  description: string;
  keywords: string[];
}

export interface City {
  name: string;
  slug: string;
  state: string;
  coordinates: CityCoordinates;
  bounds: CityBounds;
  enabled: boolean;
  collectionName: string;
  metadata: CityMetadata;
  seo: CitySEO;
}
