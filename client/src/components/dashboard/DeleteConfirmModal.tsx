import { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  templateName: string;
}

export function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  templateName,
}: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Supprimer le template">
      <p className="text-sm text-gray-600 mb-6">
        Voulez-vous vraiment supprimer <strong>{templateName}</strong> ? Cette
        action est irréversible.
      </p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button variant="danger" onClick={handleConfirm} loading={loading}>
          Supprimer
        </Button>
      </div>
    </Modal>
  );
}
