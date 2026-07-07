import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Plus, BookOpen, Lock } from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { EmptyState } from '@/shared/ui/EmptyState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { ROUTES } from '@/shared/constants/routes';
import { formatRelative } from '@/shared/lib/date';
import { useJournalEntries } from '@/features/journal/api/useJournalEntries';

// Backend mood: HAPPY | SAD | ANGRY | TIRED | PEACEFUL | LONELY | MOTIVATED | EMPTY | OTHER
const MOOD_EMOJI: Record<string, string> = {
  HAPPY: '😊',
  SAD: '😔',
  ANGRY: '😡',
  TIRED: '😫',
  PEACEFUL: '😌',
  LONELY: '🥺',
  MOTIVATED: '🤩',
  EMPTY: '😐',
  OTHER: '🤔',
  // Legacy
  AMAZING: '🤩',
  GOOD: '😊',
  NEUTRAL: '😐',
  TERRIBLE: '😞',
};

export default function JournalPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: entries = [], isLoading, isError, refetch } = useJournalEntries();

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={t('journal.errorLoad')} onRetry={refetch} />;

  return (
    <div className="space-y-5 animate-slide-up">
      <PageHeader
        title={t('journal.title')}
        actions={<Button size="sm" onClick={() => navigate(ROUTES.JOURNAL_NEW)}><Plus size={14} />{t('journal.newEntry')}</Button>}
      />
      {entries.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={24} />}
          title={t('journal.noEntries')}
          action={<Button size="sm" onClick={() => navigate(ROUTES.JOURNAL_NEW)}><Plus size={14} />{t('journal.createFirstEntry')}</Button>}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="group rounded-xl border border-border bg-card p-5 cursor-pointer card-glow transition-all duration-300"
              onClick={() => navigate(`${ROUTES.JOURNAL}/${entry.id}`)}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  {entry.mood && <span className="text-lg">{MOOD_EMOJI[entry.mood] ?? '📝'}</span>}
                  {entry.title && <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{entry.title}</h3>}
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {entry.isPrivate && <Lock size={12} className="text-muted-foreground" />}
                  <span className="text-xs text-muted-foreground">{formatRelative(entry.createdAt)}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{entry.content}</p>
              {entry.tags?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {entry.tags.map((tag) => (
                    <Badge key={tag} variant="muted">#{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
