'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Modal } from '@/components/ui/Modal';
import { AdminPointModal } from './AdminPointModal';
import { AdminDeleteConfirm } from './AdminDeleteConfirm';
import { AdminPointFormData } from '@/lib/validation/schemas';
import { getAllEnabledCities } from '@/config/cities';

type CityFilter = 'all' | string;

interface AdminPoint extends AdminPointFormData {
  id: string;
}

const enabledCities = getAllEnabledCities();

function normalizeName(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Returns IDs of duplicate points (keeps first occurrence per name+city, marks rest) */
function findDuplicateIds(points: AdminPoint[]): Set<string> {
  const seen = new Map<string, string>(); // key → first id
  const duplicates = new Set<string>();

  for (const p of points) {
    const key = `${p.citySlug}::${normalizeName(p.nome)}`;
    if (seen.has(key)) {
      duplicates.add(p.id);
    } else {
      seen.set(key, p.id);
    }
  }

  return duplicates;
}

export function AdminPointsTable() {
  const [cityFilter, setCityFilter] = useState<CityFilter>('all');
  const [points, setPoints] = useState<AdminPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selection
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Single-item modal/delete
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState<AdminPoint | undefined>(undefined);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingPoint, setDeletingPoint] = useState<AdminPoint | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  // Bulk delete
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number } | null>(null);

  const fetchPoints = useCallback(async (city: CityFilter) => {
    setIsLoading(true);
    setError(null);
    setSelected(new Set());
    try {
      const response = await fetch(`/api/admin/points?city=${city}`);
      if (!response.ok) throw new Error('Erro ao carregar pontos');
      const data = await response.json();
      setPoints(data.points ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPoints(cityFilter);
  }, [cityFilter, fetchPoints]);

  // ── Selection helpers ──────────────────────────────────────────────
  const allSelected = points.length > 0 && selected.size === points.length;
  const someSelected = selected.size > 0 && !allSelected;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(points.map(p => p.id)));
    }
  }

  function toggleOne(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // ── Duplicate detection ────────────────────────────────────────────
  const duplicateIds = useMemo(() => findDuplicateIds(points), [points]);

  function selectDuplicates() {
    if (duplicateIds.size === 0) {
      setError('Nenhum duplicado encontrado.');
      return;
    }
    setSelected(new Set(duplicateIds));
  }

  // ── Single delete ──────────────────────────────────────────────────
  async function handleDelete() {
    if (!deletingPoint) return;
    setIsDeleting(true);
    try {
      const res = await fetch(
        `/api/admin/points/${deletingPoint.id}?city=${deletingPoint.citySlug}`,
        { method: 'DELETE' }
      );
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Erro ao excluir');
        return;
      }
      setDeleteOpen(false);
      setDeletingPoint(undefined);
      fetchPoints(cityFilter);
    } catch {
      setError('Erro ao excluir ponto');
    } finally {
      setIsDeleting(false);
    }
  }

  // ── Bulk delete ────────────────────────────────────────────────────
  async function handleBulkDelete() {
    const toDelete = points.filter(p => selected.has(p.id));
    if (toDelete.length === 0) return;

    setIsBulkDeleting(true);
    setBulkProgress({ done: 0, total: toDelete.length });

    let failed = 0;
    for (let i = 0; i < toDelete.length; i++) {
      const p = toDelete[i];
      try {
        const res = await fetch(`/api/admin/points/${p.id}?city=${p.citySlug}`, {
          method: 'DELETE',
        });
        if (!res.ok) failed++;
      } catch {
        failed++;
      }
      setBulkProgress({ done: i + 1, total: toDelete.length });
    }

    setIsBulkDeleting(false);
    setBulkProgress(null);
    setBulkDeleteOpen(false);
    setSelected(new Set());

    if (failed > 0) {
      setError(`${failed} ponto(s) não puderam ser excluídos.`);
    }

    fetchPoints(cityFilter);
  }

  const cityLabel: Record<string, string> = Object.fromEntries(
    enabledCities.map(c => [c.slug, c.name])
  );

  const selectedPoints = points.filter(p => selected.has(p.id));

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* City filter tabs */}
        <div className="flex flex-wrap gap-2">
          {(['all', ...enabledCities.map(c => c.slug)] as const).map(slug => (
            <button
              key={slug}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                cityFilter === slug
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => setCityFilter(slug)}
            >
              {slug === 'all' ? 'Todos' : cityLabel[slug] ?? slug}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={selectDuplicates}
            title="Marca automaticamente pontos com nome duplicado"
          >
            Selecionar duplicados {duplicateIds.size > 0 && `(${duplicateIds.size})`}
          </Button>
          <Button variant="primary" size="sm" onClick={() => { setEditingPoint(undefined); setModalOpen(true); }}>
            + Adicionar
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="error" className="mb-2">
          {error}
        </Alert>
      )}

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          <span className="text-sm font-medium text-red-800">
            {selected.size} ponto{selected.size !== 1 ? 's' : ''} selecionado{selected.size !== 1 ? 's' : ''}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setSelected(new Set())}>
              Limpar seleção
            </Button>
            <Button variant="danger" size="sm" onClick={() => setBulkDeleteOpen(true)}>
              Excluir selecionados
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : points.length === 0 ? (
        <p className="text-center text-gray-500 py-12">Nenhum ponto encontrado.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={el => { if (el) el.indeterminate = someSelected; }}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-gray-300 text-emergency-600 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Endereço</th>
                <th className="px-4 py-3">Cidade</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {points.map(point => {
                const isSelected = selected.has(point.id);
                const isDuplicate = duplicateIds.has(point.id);
                return (
                  <tr
                    key={point.id}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-red-50'
                        : isDuplicate
                        ? 'bg-yellow-50/60'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOne(point.id)}
                        className="w-4 h-4 rounded border-gray-300 text-emergency-600 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={point.tipo === 'coleta' ? 'error' : 'warning'}>
                        {point.tipo === 'coleta' ? 'Coleta' : 'Abrigo'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[180px]">
                      <span className="truncate block">{point.nome}</span>
                      {isDuplicate && (
                        <span className="text-xs text-yellow-700 font-normal">duplicado</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">
                      {point.endereco || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {cityLabel[point.citySlug] ?? point.citySlug}
                    </td>
                    <td className="px-4 py-3 text-right space-x-1">
                      <button
                        onClick={() => { setEditingPoint(point); setModalOpen(true); }}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => { setDeletingPoint(point); setDeleteOpen(true); }}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Excluir"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 border-t border-gray-200 flex justify-between">
            <span>{points.length} ponto{points.length !== 1 ? 's' : ''}</span>
            {duplicateIds.size > 0 && (
              <span className="text-yellow-700">{duplicateIds.size} duplicado{duplicateIds.size !== 1 ? 's' : ''} detectado{duplicateIds.size !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AdminPointModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => fetchPoints(cityFilter)}
        point={editingPoint}
      />

      {/* Single delete */}
      {deletingPoint && (
        <AdminDeleteConfirm
          isOpen={deleteOpen}
          onClose={() => { setDeleteOpen(false); setDeletingPoint(undefined); }}
          onConfirm={handleDelete}
          pointName={deletingPoint.nome}
          isDeleting={isDeleting}
        />
      )}

      {/* Bulk delete confirmation */}
      <Modal
        isOpen={bulkDeleteOpen}
        onClose={() => !isBulkDeleting && setBulkDeleteOpen(false)}
        title="Excluir em massa"
        size="sm"
      >
        <div className="space-y-4">
          {isBulkDeleting && bulkProgress ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-700">
                Excluindo... {bulkProgress.done}/{bulkProgress.total}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(bulkProgress.done / bulkProgress.total) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-700">
                Tem certeza que deseja excluir{' '}
                <span className="font-semibold">{selected.size} ponto{selected.size !== 1 ? 's' : ''}</span>?
              </p>
              <ul className="max-h-40 overflow-y-auto text-sm text-gray-600 space-y-1 bg-gray-50 rounded p-3">
                {selectedPoints.map(p => (
                  <li key={p.id} className="truncate">· {p.nome} <span className="text-gray-400">({cityLabel[p.citySlug] ?? p.citySlug})</span></li>
                ))}
              </ul>
              <p className="text-sm text-red-600">Esta ação não pode ser desfeita.</p>
              <div className="flex gap-3 justify-end pt-1">
                <Button variant="secondary" size="sm" onClick={() => setBulkDeleteOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="danger" size="sm" onClick={handleBulkDelete}>
                  Excluir {selected.size}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
