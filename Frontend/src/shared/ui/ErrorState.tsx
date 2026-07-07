import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({ message, onRetry, retryLabel }: ErrorStateProps) {
  const { t } = useTranslation();
  const displayMessage = message || t('common.error');
  const displayRetryLabel = retryLabel || t('errors.tryAgain');

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 text-destructive">
        <AlertTriangle size={28} />
      </div>
      <div className="space-y-1.5">
        <p className="font-medium text-foreground">Oops!</p>
        <p className="text-sm text-muted-foreground max-w-xs">{displayMessage}</p>
      </div>
      {onRetry && <Button variant="outline" size="sm" onClick={onRetry}>{displayRetryLabel}</Button>}
    </div>
  );
}
