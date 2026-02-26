import { z } from 'zod';
import { DONATION_TYPES } from '@/types/point';

// Validation schema for point registration
export const pointSchema = z.object({
  tipo: z.enum(['coleta', 'abrigo']),

  nome: z
    .string({ message: 'Nome é obrigatório' })
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),

  endereco: z
    .string()
    .min(10, 'Endereço deve ter no mínimo 10 caracteres')
    .max(200, 'Endereço deve ter no máximo 200 caracteres')
    .trim()
    .optional()
    .or(z.literal('')),

  complemento: z
    .string()
    .max(200, 'Complemento deve ter no máximo 200 caracteres')
    .trim()
    .optional()
    .or(z.literal('')),

  horarios: z
    .string()
    .max(100, 'Horários deve ter no máximo 100 caracteres')
    .trim()
    .optional()
    .or(z.literal('')),

  doacoes: z
    .array(z.string())
    .min(1, 'Selecione pelo menos um tipo de doação')
    .max(6, 'Selecione no máximo 6 tipos de doação'),

  responsavel: z
    .string()
    .max(100, 'Nome do responsável deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]*$/, 'Nome deve conter apenas letras')
    .trim()
    .optional()
    .or(z.literal('')),

  telefone: z
    .string()
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone inválido. Use o formato (XX) XXXXX-XXXX')
    .optional()
    .or(z.literal('')),

  capacidade: z
    .number({ message: 'Capacidade deve ser um número' })
    .int('Capacidade deve ser um número inteiro')
    .positive('Capacidade deve ser maior que zero')
    .optional()
    .nullable(),

  lat: z
    .number({ message: 'Localização é obrigatória' })
    .min(-90, 'Latitude inválida')
    .max(90, 'Latitude inválida')
    .optional()
    .nullable(),

  lng: z
    .number({ message: 'Localização é obrigatória' })
    .min(-180, 'Longitude inválida')
    .max(180, 'Longitude inválida')
    .optional()
    .nullable(),

  citySlug: z.string({ message: 'Cidade é obrigatória' }),

  consent: z.boolean().refine(val => val === true, {
    message: 'Você deve concordar com o uso dos dados',
  }),
}).refine(
  (data) => {
    // If tipo is abrigo, capacidade is required
    if (data.tipo === 'abrigo' && !data.capacidade) {
      return false;
    }
    return true;
  },
  {
    message: 'Capacidade é obrigatória para abrigos',
    path: ['capacidade'],
  }
).refine(
  (data) => {
    // Either endereco or coordinates must be provided
    if (!data.endereco && (!data.lat || !data.lng)) {
      return false;
    }
    return true;
  },
  {
    message: 'Forneça um endereço ou selecione a localização no mapa',
    path: ['endereco'],
  }
);

export type PointFormData = z.infer<typeof pointSchema>;
