import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';
import { Button } from '@/shared/ui/Button';

export default function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center">
      <p className="text-7xl font-mono font-bold text-primary/20">404</p>
      <p className="text-xl font-semibold text-foreground">{t('errors.notFoundTitle')}</p>
      <p className="text-sm text-muted-foreground">{t('errors.notFoundDescription')}</p>
      <Button onClick={() => navigate(ROUTES.DASHBOARD)}>{t('errors.backToDashboard')}</Button>
    </div>
  );
}
