import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'danger' | 'warning';
  loading?: boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  variant = 'primary',
  loading = false,
}: ConfirmModalProps) {
  const { t } = useTranslation();
  const displayConfirmText = confirmText || t('common.confirm');
  const displayCancelText = cancelText || t('common.cancel');

  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {displayCancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : variant === 'warning' ? 'secondary' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {displayConfirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
export default ConfirmModal;
