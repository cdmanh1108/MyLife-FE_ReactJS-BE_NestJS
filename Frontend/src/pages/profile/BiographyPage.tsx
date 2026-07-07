import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Textarea } from '@/shared/ui/Textarea';
import { LoadingState } from '@/shared/ui/LoadingState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { ROUTES } from '@/shared/constants/routes';
import { useBiography, useUpdateBiography } from '@/features/profile/api/useProfile';
import { toast } from 'sonner';

export default function BiographyPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');

  const { data: biography, isLoading, isError, refetch } = useBiography();
  const updateMutation = useUpdateBiography();

  // Sync state when data is loaded
  useEffect(() => {
    if (biography) {
      setContent(biography.content || '');
    }
  }, [biography]);

  const handleSave = () => {
    updateMutation.mutate(
      { content },
      {
        onSuccess: () => {
          toast.success(t('profile.toastUpdateSuccess'));
          setIsEditing(false);
        },
        onError: () => {
          toast.error(t('profile.toastUpdateError'));
        },
      }
    );
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={t('profile.errorLoad')} onRetry={refetch} />;

  const paragraphs = content.trim().split('\n\n').filter(Boolean);

  return (
    <div className="max-w-2xl space-y-5 animate-slide-up">
      <PageHeader
        title={t('nav.biography')}
        actions={
          <div className="flex gap-2">
            {!isEditing ? (
              <Button size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 size={14} />{t('common.edit')}
              </Button>
            ) : (
              <>
                <Button size="sm" variant="ghost" onClick={() => { setIsEditing(false); setContent(biography?.content || ''); }}>
                  {t('common.cancel')}
                </Button>
                <Button size="sm" onClick={handleSave} loading={updateMutation.isPending}>
                  {t('common.save')}
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.PROFILE)}>
              <ArrowLeft size={14} />{t('common.back')}
            </Button>
          </div>
        }
      />

      <Card className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              label={t('profile.bioLabel')}
              placeholder={t('profile.bioPlaceholder')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
            />
          </div>
        ) : (
          <div className="space-y-4 text-foreground leading-relaxed prose prose-invert prose-sm max-w-none">
            {paragraphs.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">{t('profile.emptyBio')}</p>
            ) : (
              paragraphs.map((p, idx) => (
                <p key={idx} className="whitespace-pre-line text-sm text-foreground/90">
                  {p}
                </p>
              ))
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
