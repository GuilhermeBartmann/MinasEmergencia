'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface AdminDeleteConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pointName: string;
  isDeleting: boolean;
}

export function AdminDeleteConfirm({
  isOpen,
  onClose,
  onConfirm,
  pointName,
  isDeleting,
}: AdminDeleteConfirmProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Exclusão" size="sm">
      <div className="space-y-4">
        <p className="text-gray-700">
          Tem certeza que deseja excluir o ponto{' '}
          <span className="font-semibold">&quot;{pointName}&quot;</span>?
        </p>
        <p className="text-sm text-red-600">
          Esta ação não pode ser desfeita. O documento será removido permanentemente do Firestore.
        </p>
        <div className="flex gap-3 justify-end pt-2">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={isDeleting}
            disabled={isDeleting}
          >
            Excluir
          </Button>
        </div>
      </div>
    </Modal>
  );
}
