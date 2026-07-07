import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, RotateCcw, ThumbsUp, ThumbsDown, Plus } from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { EmptyState } from '@/shared/ui/EmptyState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { useFlashcards, useCreateFlashcard, useReviewFlashcard } from '@/features/learning/api/useFlashcards';
import { toast } from 'sonner';

export default function FlashcardsPage() {
  const { t } = useTranslation();
  const modal = useDisclosure();
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Form states
  const [formLanguage, setFormLanguage] = useState<'IELTS' | 'TOPIK'>('TOPIK');
  const [formFront, setFormFront] = useState('');
  const [formBack, setFormBack] = useState('');

  const { data: cards = [], isLoading, isError, refetch } = useFlashcards();
  const createMutation = useCreateFlashcard();
  const reviewMutation = useReviewFlashcard();

  const next = () => {
    if (cards.length === 0) return;
    setIdx((i) => (i + 1) % cards.length);
    setFlipped(false);
  };
  const prev = () => {
    if (cards.length === 0) return;
    setIdx((i) => (i - 1 + cards.length) % cards.length);
    setFlipped(false);
  };

  const handleReview = (status: 'MASTERED' | 'LEARNING') => {
    if (cards.length === 0) return;
    const card = cards[idx];
    reviewMutation.mutate(
      { id: card.id, status },
      {
        onSuccess: () => {
          toast.success(status === 'MASTERED' ? t('learning.toastMastered') : t('learning.toastReviewLater'));
          next();
        },
        onError: () => toast.error(t('learning.toastUpdateProgressError')),
      }
    );
  };

  const handleSave = () => {
    if (!formFront.trim() || !formBack.trim()) {
      toast.error(t('learning.toastFillFrontAndBack'));
      return;
    }
    createMutation.mutate(
      { language: formLanguage, front: formFront.trim(), back: formBack.trim() },
      {
        onSuccess: () => {
          toast.success(t('learning.toastFlashcardAdded'));
          modal.close();
          setFormFront('');
          setFormBack('');
        },
        onError: () => toast.error(t('learning.toastFlashcardAddError')),
      }
    );
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={t('learning.errorLoadFlashcards')} onRetry={refetch} />;

  const card = cards[idx];

  return (
    <div className="space-y-6 animate-slide-up">
      <PageHeader
        title={t('nav.flashcards')}
        actions={<Button size="sm" onClick={modal.open}><Plus size={14} />{t('learning.addCard')}</Button>}
      />

      {cards.length === 0 ? (
        <EmptyState
          icon={<RotateCcw size={24} />}
          title={t('learning.noFlashcards')}
          action={<Button size="sm" onClick={modal.open}>{t('learning.addFirstCard')}</Button>}
        />
      ) : (
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
            <span>{idx + 1} / {cards.length}</span>
            <div className="flex gap-1.5">
              <Badge variant={card.language === 'TOPIK' ? 'info' : 'success'}>{card.language}</Badge>
              <Badge variant="muted">{card.status}</Badge>
            </div>
          </div>

          <div
            className="relative h-56 cursor-pointer rounded-2xl border border-border bg-card select-none transition-all duration-300 card-glow"
            onClick={() => setFlipped((v) => !v)}
            style={{ perspective: '1000px' }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              {!flipped ? (
                <>
                  <p className="text-3xl font-semibold text-foreground font-mono">{card.front}</p>
                  <p className="mt-4 text-xs text-muted-foreground">{t('learning.clickToReveal')}</p>
                </>
              ) : (
                <>
                  <p className="text-xl font-medium text-primary">{card.back}</p>
                  <p className="mt-4 text-xs text-muted-foreground">{t('learning.clickToHide')}</p>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={prev}
              className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-3">
              <Button variant="danger" size="sm" onClick={() => handleReview('LEARNING')} loading={reviewMutation.isPending}>
                <ThumbsDown size={14} />{t('learning.notMastered')}
              </Button>
              <Button variant="secondary" size="sm" onClick={next}>
                <RotateCcw size={14} />{t('common.skip')}
              </Button>
              <Button size="sm" onClick={() => handleReview('MASTERED')} loading={reviewMutation.isPending}>
                <ThumbsUp size={14} />{t('learning.mastered')}
              </Button>
            </div>
            <button
              onClick={next}
              className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      <Modal open={modal.isOpen} onClose={modal.close} title={t('learning.addFlashcard')}>
        <div className="space-y-4">
          <Select
            label={t('learning.studyLanguage')}
            options={[{ value: 'TOPIK', label: 'TOPIK (Korean)' }, { value: 'IELTS', label: 'IELTS (English)' }]}
            value={formLanguage}
            onChange={(e) => setFormLanguage(e.target.value as any)}
          />
          <Input label={t('learning.cardFront')} placeholder={t('learning.cardFrontPlaceholder')} value={formFront} onChange={(e) => setFormFront(e.target.value)} />
          <Input label={t('learning.cardBack')} placeholder={t('learning.cardBackPlaceholder')} value={formBack} onChange={(e) => setFormBack(e.target.value)} />
          
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" onClick={modal.close} fullWidth>{t('common.cancel')}</Button>
            <Button fullWidth onClick={handleSave} loading={createMutation.isPending}>{t('common.save')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
