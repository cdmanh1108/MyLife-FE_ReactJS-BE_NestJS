import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Music, Film, Gamepad2, BookOpen, Quote, Trash2, HelpCircle } from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button } from '@/shared/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { LoadingState } from '@/shared/ui/LoadingState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { useInterests, useCreateInterest, useDeleteInterest } from '@/features/interests/api/useInterests';
import { toast } from 'sonner';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';

type InterestType = 'MUSIC_GROUP' | 'SONG' | 'MOVIE' | 'ACTOR' | 'GAME' | 'BOOK' | 'QUOTE' | 'ANIME' | 'OTHER';

const CATEGORY_MAP: Record<string, { labelKey: string; icon: React.ReactNode; types: InterestType[] }> = {
  music: {
    labelKey: 'interests.categoryMusic',
    icon: <Music size={16} />,
    types: ['MUSIC_GROUP', 'SONG'],
  },
  movies: {
    labelKey: 'interests.categoryMovies',
    icon: <Film size={16} />,
    types: ['MOVIE', 'ACTOR', 'ANIME'],
  },
  games: {
    labelKey: 'interests.categoryGames',
    icon: <Gamepad2 size={16} />,
    types: ['GAME'],
  },
  books: {
    labelKey: 'interests.categoryBooks',
    icon: <BookOpen size={16} />,
    types: ['BOOK'],
  },
  other: {
    labelKey: 'interests.categoryOther',
    icon: <HelpCircle size={16} />,
    types: ['OTHER'],
  },
};

export default function InterestsPage() {
  const { t } = useTranslation();
  const modal = useDisclosure();

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form states
  const [formType, setFormType] = useState<InterestType>('MUSIC_GROUP');
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formReason, setFormReason] = useState('');
  const [formRating, setFormRating] = useState('');

  const { data: interests = [], isLoading, isError, refetch } = useInterests();
  const createMutation = useCreateInterest();
  const deleteMutation = useDeleteInterest();

  const handleSave = () => {
    if (!formName.trim()) {
      toast.error(formType === 'QUOTE' ? t('interests.toastEnterQuote') : t('interests.toastEnterName'));
      return;
    }
    const payload = {
      type: formType,
      name: formName.trim(),
      description: formDescription.trim() || undefined,
      reason: formReason.trim() || undefined,
      rating: formRating ? Number(formRating) : undefined,
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success(t('interests.toastCreateSuccess'));
        modal.close();
        setFormName('');
        setFormDescription('');
        setFormReason('');
        setFormRating('');
      },
      onError: () => toast.error(t('interests.toastCreateError')),
    });
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={t('interests.errorLoad')} onRetry={refetch} />;

  // Filter quotes separately
  const quotesList = interests.filter((i) => i.type === 'QUOTE');
  
  // Filter others into groups
  const getItemsForCategory = (types: InterestType[]) => {
    return interests.filter((i) => types.includes(i.type));
  };

  return (
    <div className="space-y-5 animate-slide-up">
      <PageHeader
        title={t('interests.title')}
        actions={<Button size="sm" onClick={modal.open}><Plus size={14} />{t('common.add')}</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {Object.entries(CATEGORY_MAP).map(([key, category]) => {
          const items = getItemsForCategory(category.types);
          return (
            <Card key={key} className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">{category.icon}{t(category.labelKey)}</CardTitle>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">{t('common.empty')}</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <Badge
                        key={item.id}
                        variant="muted"
                        className="flex items-center gap-1.5 py-1 px-2.5 group hover:border-destructive/40 transition-colors"
                      >
                        <span>{item.name}</span>
                        {item.rating && <span className="text-[10px] text-yellow-500 font-semibold font-mono">({item.rating}/10)</span>}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all ml-1 size-3.5 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Quote size={14} />{t('interests.favoriteQuotes')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {quotesList.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">{t('common.empty')}</p>
          ) : (
            quotesList.map((q) => (
              <blockquote key={q.id} className="relative border-l-2 border-primary/30 pl-3 group flex items-start justify-between">
                <div>
                  <p className="text-sm text-foreground italic">"{q.name}"</p>
                  {q.description && <p className="text-xs text-muted-foreground mt-1">— {q.description}</p>}
                </div>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity size-7 flex items-center justify-center rounded-md hover:bg-secondary/40"
                  title={t('interests.deleteQuote')}
                >
                  <Trash2 size={13} />
                </button>
              </blockquote>
            ))
          )}
        </CardContent>
      </Card>

      <Modal open={modal.isOpen} onClose={modal.close} title={t('interests.addTitle')}>
        <div className="space-y-4">
          <Select
            label={t('interests.type')}
            options={[
              { value: 'MUSIC_GROUP', label: t('interests.typeMusicGroup') },
              { value: 'SONG', label: t('interests.typeSong') },
              { value: 'MOVIE', label: t('interests.typeMovie') },
              { value: 'ANIME', label: t('interests.typeAnime') },
              { value: 'ACTOR', label: t('interests.typeActor') },
              { value: 'GAME', label: t('interests.typeGame') },
              { value: 'BOOK', label: t('interests.typeBook') },
              { value: 'QUOTE', label: t('interests.typeQuote') },
              { value: 'OTHER', label: t('common.other') },
            ]}
            value={formType}
            onChange={(e) => setFormType(e.target.value as InterestType)}
          />

          <Input
            label={formType === 'QUOTE' ? t('interests.quoteText') : t('interests.interestName')}
            placeholder={formType === 'QUOTE' ? t('interests.quotePlaceholder') : t('interests.interestNamePlaceholder')}
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />

          <Input
            label={formType === 'QUOTE' ? t('interests.quoteAuthor') : t('interests.interestDescription')}
            placeholder={formType === 'QUOTE' ? t('interests.quoteAuthorPlaceholder') : t('interests.interestDescriptionPlaceholder')}
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          />

          {formType !== 'QUOTE' && (
            <>
              <Input
                label={t('interests.favoriteReason')}
                placeholder={t('interests.favoriteReasonPlaceholder')}
                value={formReason}
                onChange={(e) => setFormReason(e.target.value)}
              />
              <Input
                label={t('interests.ratingLabel')}
                type="number"
                min="0"
                max="10"
                placeholder={t('interests.ratingPlaceholder')}
                value={formRating}
                onChange={(e) => setFormRating(e.target.value)}
              />
            </>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="ghost" onClick={modal.close} fullWidth>{t('common.cancel')}</Button>
            <Button fullWidth onClick={handleSave} loading={createMutation.isPending}>{t('common.save')}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteMutation.mutate(deleteId, {
              onSuccess: () => {
                toast.success(t('interests.toastDeleteSuccess'));
                setDeleteId(null);
              },
              onError: () => toast.error(t('interests.toastDeleteError')),
            });
          }
        }}
        title={t('interests.deleteTitle')}
        description={t('confirmations.deleteInterest')}
        variant="danger"
        confirmText={t('common.delete')}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
