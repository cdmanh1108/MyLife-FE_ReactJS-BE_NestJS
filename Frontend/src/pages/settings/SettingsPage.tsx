import { useTranslation } from 'react-i18next';
import { LogOut, Globe, Shield, Info } from 'lucide-react';
import { useNavigate } from 'react-router';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher';
import { useAuth } from '@/shared/hooks/useAuth';
import { ROUTES } from '@/shared/constants/routes';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="max-w-xl space-y-5 animate-slide-up">
      <PageHeader title={t('settings.title')} />

      <Card className="space-y-4">
        <CardHeader><CardTitle className="flex items-center gap-2"><Globe size={14} />{t('settings.language')}</CardTitle></CardHeader>
        <CardContent>
          <LanguageSwitcher />
          <p className="text-xs text-muted-foreground mt-2">{t('settings.languageDescription')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Info size={14} />{t('settings.theme')}</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t('settings.themeDescription')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Shield size={14} />API</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Backend URL</span>
            <span className="font-mono text-xs text-foreground">{import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground">{t('settings.apiConfigured')}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Button variant="danger" fullWidth onClick={handleLogout}>
            <LogOut size={14} />
            {t('settings.logout')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
