import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { LogOut, Globe, Palette, Shield, Info, User, Check, Edit2, Server } from 'lucide-react';

import { PageHeader } from '@/shared/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { useAuth } from '@/shared/hooks/useAuth';
import { useUpdateProfile } from '@/features/profile/api/useProfile';
import { ROUTES } from '@/shared/constants/routes';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const updateProfile = useUpdateProfile();

  const [editingProfile, setEditingProfile] = useState(false);
  const [formDisplayName, setFormDisplayName] = useState(user?.name ?? '');

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const handleSaveProfile = () => {
    if (!formDisplayName.trim()) {
      toast.error(t('common.required'));
      return;
    }
    updateProfile.mutate(
      { displayName: formDisplayName.trim() },
      {
        onSuccess: () => {
          toast.success(t('profile.profileUpdateSuccess'));
          setEditingProfile(false);
        },
        onError: () => toast.error(t('profile.profileUpdateError')),
      }
    );
  };

  const APP_VERSION = '1.0.0';

  return (
    <div className="max-w-xl space-y-5 animate-slide-up">
      <PageHeader title={t('settings.title')} />

      {/* Profile section */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <User size={14} />
              {t('profile.title')}
            </span>
            {!editingProfile && (
              <button
                onClick={() => {
                  setFormDisplayName(user?.name ?? '');
                  setEditingProfile(true);
                }}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer"
              >
                <Edit2 size={12} />
                {t('common.edit')}
              </button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {editingProfile ? (
            <div className="space-y-3">
              <Input
                label={t('profile.name')}
                value={formDisplayName}
                onChange={(e) => setFormDisplayName(e.target.value)}
                placeholder={t('profile.defaultUser')}
              />
              <div className="flex gap-2 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingProfile(false)}
                  fullWidth
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  size="sm"
                  fullWidth
                  onClick={handleSaveProfile}
                  loading={updateProfile.isPending}
                >
                  <Check size={12} />
                  {t('common.save')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold text-lg font-mono flex-shrink-0">
                {(user?.name ?? 'U').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate">{user?.name ?? t('profile.defaultUser')}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Language section */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe size={14} />
            {t('settings.language')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <LanguageSwitcher />
          <p className="text-xs text-muted-foreground">{t('settings.languageDescription')}</p>
        </CardContent>
      </Card>

      {/* Theme section */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette size={14} />
            {t('settings.theme')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ThemeToggle />
          <p className="text-xs text-muted-foreground">{t('settings.themeDescription')}</p>
        </CardContent>
      </Card>

      {/* API Info section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server size={14} />
            {t('settings.apiStatus')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t('settings.apiBackendUrl')}</span>
            <span className="font-mono text-xs text-foreground truncate max-w-[200px]">
              {import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">{t('settings.apiConfigured')}</span>
          </div>
        </CardContent>
      </Card>

      {/* App info section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info size={14} />
            {t('settings.version')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">MyLife OS</span>
            <span className="font-mono text-xs border border-border rounded px-2 py-0.5 text-foreground">
              v{APP_VERSION}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Shield size={14} />
            {t('settings.dangerZone')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">{t('settings.dangerZoneDesc')}</p>
          <Button variant="danger" fullWidth onClick={handleLogout}>
            <LogOut size={14} />
            {t('settings.logout')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
