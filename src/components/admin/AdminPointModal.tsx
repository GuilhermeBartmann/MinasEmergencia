'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminPointSchema, AdminPointFormData } from '@/lib/validation/schemas';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { FormInput } from '@/components/forms/FormInput';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { PhoneInput } from '@/components/forms/PhoneInput';
import { TypeToggle } from '@/components/forms/TypeToggle';
import { DonationCheckboxes } from '@/components/forms/DonationCheckboxes';
import { getAllEnabledCities } from '@/config/cities';

interface AdminPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /** When provided, modal is in edit mode */
  point?: AdminPointFormData & { id: string };
}

const cities = getAllEnabledCities();

export function AdminPointModal({
  isOpen,
  onClose,
  onSuccess,
  point,
}: AdminPointModalProps) {
  const isEdit = !!point;
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminPointFormData>({
    resolver: zodResolver(adminPointSchema),
    defaultValues: {
      tipo: 'coleta',
      doacoes: [],
      citySlug: cities[0]?.slug ?? 'jf',
      lat: 0,
      lng: 0,
    },
  });

  const tipo = watch('tipo');

  useEffect(() => {
    if (isOpen) {
      if (point) {
        reset(point);
      } else {
        reset({
          tipo: 'coleta',
          doacoes: [],
          citySlug: cities[0]?.slug ?? 'jf',
          lat: 0,
          lng: 0,
        });
      }
      setSubmitError(null);
    }
  }, [isOpen, point, reset]);

  async function onSubmit(data: AdminPointFormData) {
    setSubmitError(null);
    try {
      let response: Response;

      if (isEdit) {
        response = await fetch(`/api/admin/points/${point.id}?city=${point.citySlug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } else {
        response = await fetch('/api/admin/points', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }

      if (!response.ok) {
        const result = await response.json();
        setSubmitError(result.error || 'Erro ao salvar ponto.');
        return;
      }

      onSuccess();
      onClose();
    } catch {
      setSubmitError('Erro ao conectar. Tente novamente.');
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Editar Ponto' : 'Adicionar Ponto'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pb-2">
        {submitError && <Alert variant="error">{submitError}</Alert>}

        {/* Tipo */}
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

        {/* Cidade */}
        <div className="w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Cidade <span className="text-red-600 ml-1">*</span>
          </label>
          <select
            {...register('citySlug')}
            disabled={isEdit}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emergency-500 focus:border-emergency-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {cities.map(c => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.citySlug && (
            <p className="mt-1 text-sm text-red-600">⚠ {errors.citySlug.message}</p>
          )}
        </div>

        {/* Capacidade — apenas abrigo */}
        {tipo === 'abrigo' && (
          <FormInput
            label="Capacidade Aproximada"
            type="number"
            placeholder="Ex: 50"
            {...register('capacidade', { valueAsNumber: true })}
            error={errors.capacidade?.message}
            helperText="Número de pessoas que o abrigo pode acolher"
            required
          />
        )}

        {/* Nome */}
        <FormInput
          label="Nome do Ponto"
          placeholder="Ex: Centro Comunitário São Pedro"
          {...register('nome')}
          error={errors.nome?.message}
          required
        />

        {/* Endereço */}
        <FormInput
          label="Endereço"
          placeholder="Ex: Rua das Flores, 123 - Centro"
          {...register('endereco')}
          error={errors.endereco?.message}
        />

        {/* Lat / Lng */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Latitude"
            type="number"
            step="any"
            placeholder="-21.7642"
            {...register('lat', { valueAsNumber: true })}
            error={errors.lat?.message}
            required
          />
          <FormInput
            label="Longitude"
            type="number"
            step="any"
            placeholder="-43.3502"
            {...register('lng', { valueAsNumber: true })}
            error={errors.lng?.message}
            required
          />
        </div>

        {/* Complemento */}
        <FormTextarea
          label="Complemento"
          placeholder="Ex: Entrada pela lateral"
          {...register('complemento')}
          error={errors.complemento?.message}
        />

        {/* Horários */}
        <FormInput
          label="Horários de Funcionamento"
          placeholder="Ex: Segunda a Sexta, 8h às 18h"
          {...register('horarios')}
          error={errors.horarios?.message}
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

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isEdit ? 'Salvar' : 'Adicionar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
