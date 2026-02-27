'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pointSchema, PointFormData } from '@/lib/validation/schemas';
import { useGeocoding } from '@/hooks/useGeocoding';
import { FormInput } from './FormInput';
import { FormTextarea } from './FormTextarea';
import { PhoneInput } from './PhoneInput';
import { TypeToggle } from './TypeToggle';
import { DonationCheckboxes } from './DonationCheckboxes';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export interface PointFormProps {
  citySlug: string;
  onSuccess?: () => void;
  onMapPickerToggle?: (enabled: boolean) => void;
  selectedLocation?: { lat: number; lng: number } | null;
}

export function PointForm({
  citySlug,
  onSuccess,
  onMapPickerToggle,
  selectedLocation,
}: PointFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [mapPickerEnabled, setMapPickerEnabled] = useState(false);

  const { geocode, loading: geocoding, error: geocodeError } = useGeocoding();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PointFormData>({
    resolver: zodResolver(pointSchema),
    defaultValues: {
      tipo: 'coleta',
      doacoes: [],
      citySlug,
      consent: false,
    },
  });

  const tipo = watch('tipo');
  const endereco = watch('endereco');

  // Update coordinates when location is selected and reset picker button
  useEffect(() => {
    if (selectedLocation) {
      setValue('lat', selectedLocation.lat);
      setValue('lng', selectedLocation.lng);
      setMapPickerEnabled(false);
    }
  }, [selectedLocation, setValue]);

  const toggleMapPicker = () => {
    const newState = !mapPickerEnabled;
    setMapPickerEnabled(newState);
    if (onMapPickerToggle) {
      onMapPickerToggle(newState);
    }
  };

  const onSubmit = async (data: PointFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Geocode address if not using map picker
      let lat = data.lat;
      let lng = data.lng;

      if (!lat || !lng) {
        if (data.endereco) {
          const result = await geocode(data.endereco, citySlug);
          if (!result) {
            throw new Error('Não foi possível localizar o endereço. Use o mapa para selecionar a localização.');
          }
          lat = result.lat;
          lng = result.lng;
        } else {
          throw new Error('Forneça um endereço ou selecione a localização no mapa.');
        }
      }

      // Submit to API
      const response = await fetch('/api/points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          lat,
          lng,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(
            `Aguarde ${result.retryAfter || 30} segundos antes de cadastrar outro ponto.`
          );
        }
        throw new Error(result.error || 'Erro ao cadastrar ponto');
      }

      // Success!
      setSubmitSuccess(true);
      reset();
      setMapPickerEnabled(false);

      // Show success for 2 seconds then call onSuccess
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);
    } catch (error) {
      console.error('Error submitting point:', error);
      setSubmitError(error instanceof Error ? error.message : 'Erro ao cadastrar ponto. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">✓</div>
        <h3 className="text-2xl font-bold text-green-600 mb-2">
          Ponto Cadastrado!
        </h3>
        <p className="text-gray-600">
          O ponto aparecerá no mapa em instantes
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Error Alert */}
      {submitError && (
        <Alert variant="error">
          {submitError}
        </Alert>
      )}

      {/* Geocoding Error */}
      {geocodeError && (
        <Alert variant="warning">
          {geocodeError}
        </Alert>
      )}

      {/* Type Toggle */}
      <Controller
        name="tipo"
        control={control}
        render={({ field }) => (
          <TypeToggle
            value={field.value}
            onChange={field.onChange}
            error={errors.tipo?.message}
          />
        )}
      />

      {/* Capacity (only for abrigo) */}
      {tipo === 'abrigo' && (
        <FormInput
          label="Capacidade Aproximada"
          type="number"
          placeholder="Ex: 50"
          {...register('capacidade', { valueAsNumber: true })}
          error={errors.capacidade?.message}
          helperText="Número aproximado de pessoas que o abrigo pode acolher"
          required
        />
      )}

      {/* Nome */}
      <FormInput
        label="Nome do Ponto"
        placeholder="Ex: Centro Comunitário São Pedro"
        {...register('nome')}
        error={errors.nome?.message}
        helperText="Nome ou descrição do local"
        required
      />

      {/* Endereço */}
      <FormInput
        label="Endereço Completo"
        placeholder="Ex: Rua das Flores, 123 - Centro"
        {...register('endereco')}
        error={errors.endereco?.message}
        helperText={
          endereco
            ? 'Endereço fornecido'
            : selectedLocation
            ? 'Localização definida no mapa'
            : 'Forneça o endereço ou use o mapa'
        }
        required={!selectedLocation}
      />

      {/* Map Picker Button */}
      <div>
        <Button
          type="button"
          variant={mapPickerEnabled ? 'success' : 'secondary'}
          onClick={toggleMapPicker}
          fullWidth
          className="mb-2"
        >
          {mapPickerEnabled ? (
            <>
              <span>✓</span>
              <span>Modo Seleção Ativo</span>
            </>
          ) : (
            <>
              <span>🗺️</span>
              <span>Indicar no Mapa</span>
            </>
          )}
        </Button>
        {selectedLocation && (
          <p className="text-sm text-green-600 flex items-center gap-1">
            <span>✓</span>
            Localização definida: {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
          </p>
        )}
        {mapPickerEnabled && (
          <Alert variant="info" className="mt-2">
            <p className="text-sm">
              Clique no mapa para selecionar a localização exata do ponto. Você pode arrastar o marcador verde para ajustar.
            </p>
          </Alert>
        )}
      </div>

      {/* Complemento */}
      <FormTextarea
        label="Complemento"
        placeholder="Ex: Entrada pela lateral, portão azul"
        {...register('complemento')}
        error={errors.complemento?.message}
        helperText="Informações adicionais para facilitar a localização"
      />

      {/* Horários */}
      <FormInput
        label="Horários de Funcionamento"
        placeholder="Ex: Segunda a Sexta, 8h às 18h"
        {...register('horarios')}
        error={errors.horarios?.message}
        helperText="Horários em que o ponto aceita doações ou visitas"
      />

      {/* Doações */}
      <Controller
        name="doacoes"
        control={control}
        render={({ field }) => (
          <DonationCheckboxes
            selectedDonations={field.value}
            onChange={field.onChange}
            error={errors.doacoes?.message}
          />
        )}
      />

      {/* Responsável */}
      <FormInput
        label="Nome do Responsável"
        placeholder="Ex: Maria Silva"
        {...register('responsavel')}
        error={errors.responsavel?.message}
        helperText="Pessoa responsável pelo ponto (opcional)"
      />

      {/* Telefone */}
      <Controller
        name="telefone"
        control={control}
        render={({ field }) => (
          <PhoneInput
            label="Telefone para Contato"
            value={field.value}
            onChange={field.onChange}
            error={errors.telefone?.message}
          />
        )}
      />

      {/* Consent Checkbox */}
      <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('consent')}
            className="mt-1 w-5 h-5 text-emergency-600 border-gray-300 rounded focus:ring-emergency-500"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              Concordo com o uso dos dados
              <span className="text-red-600 ml-1">*</span>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              As informações fornecidas serão públicas e utilizadas apenas para
              ajudar pessoas em situação de emergência. Não compartilharemos seus
              dados pessoais com terceiros. Sistema LGPD compliant.
            </p>
          </div>
        </label>
        {errors.consent && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <span>⚠</span>
            {errors.consent.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isSubmitting || geocoding}
        disabled={isSubmitting || geocoding}
      >
        {isSubmitting ? 'Cadastrando...' : geocoding ? 'Localizando...' : 'Cadastrar Ponto'}
      </Button>

      <p className="text-xs text-center text-gray-500">
        Após o cadastro, o ponto aparecerá no mapa em alguns segundos
      </p>
    </form>
  );
}
