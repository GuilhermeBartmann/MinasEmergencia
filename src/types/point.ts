import { Timestamp } from 'firebase/firestore';

export type PointType = 'coleta' | 'abrigo';

export interface Point {
  id?: string;
  tipo: PointType;
  nome: string;
  endereco: string;
  complemento?: string;
  horarios?: string;
  doacoes: string[];
  responsavel?: string;
  telefone?: string;
  capacidade?: number;
  lat: number;
  lng: number;
  timestamp: Timestamp | Date;
  citySlug: string;
  _version: number;
}

export interface PointFormData {
  tipo: PointType;
  nome: string;
  endereco: string;
  complemento?: string;
  horarios?: string;
  doacoes: string[];
  responsavel?: string;
  telefone?: string;
  capacidade?: number;
  lat?: number;
  lng?: number;
  citySlug: string;
}

export const DONATION_TYPES = [
  'Roupas',
  'Alimentos',
  'Água',
  'Higiene',
  'Medicamentos',
  'Outros'
] as const;

export type DonationType = typeof DONATION_TYPES[number];
