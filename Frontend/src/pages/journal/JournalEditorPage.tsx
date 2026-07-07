import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save, Lock, Unlock } from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { Select } from '@/shared/ui/Select';
import { Badge } from '@/shared/ui/Badge';
import { ROUTES } from '@/shared/constants/routes';
import { useCreateJournalEntry } from '@/features/journal/api/useJournalEntries';
import { toast } from 'sonner';

export default function JournalEditorPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isPrivate, setIsPrivate] = useState(true);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');

  const createEntry = useCreateJournalEntry();

  const moodOptions = [
    { value: '', label: t('journal.noMoodSelected') },
    { value: 'HAPPY', label: `😊 ${t('moods.happy')}` },
    { value: 'PEACEFUL', label: `😌 ${t('moods.peaceful')}` },
    { value: 'MOTIVATED', label: `🤩 ${t('moods.motivated')}` },
    { value: 'TIRED', label: `😫 ${t('moods.tired')}` },
    { value: 'SAD', label: `😔 ${t('moods.sad')}` },
    { value: 'LONELY', label: `🥺 ${t('moods.lonely')}` },
    { value: 'ANGRY', label: `😡 ${t('moods.angry')}` },
    { value: 'EMPTY', label: `😐 ${t('moods.empty')}` },
    { value: 'OTHER', label: `🤔 ${t('moods.other')}` },
  ];

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setTags((prev) => [...new Set([...prev, tagInput.trim()])]);
      setTagInput('');
    }
  };

  const handleSave = () => {
    if (!content.trim()) { toast.error(t('journal.toastEnterContent')); return; }
    createEntry.mutate(
      { title: title || undefined, content, mood: mood || undefined, tags, isPrivate },
      {
        onSuccess: () => {
          toast.success(t('journal.toastCreateSuccess'));
          navigate(ROUTES.JOURNAL);
        },
        onError: () => toast.error(t('journal.toastCreateError')),
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-slide-up">
      <PageHeader
        title={t('journal.newEntry')}
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.JOURNAL)}>
              <ArrowLeft size={14} /> {t('common.back')}
            </Button>
            <Button size="sm" onClick={handleSave} loading={createEntry.isPending}>
              <Save size={14} />{t('common.save')}
            </Button>
          </div>
        }
      />

      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <Input
          label={t('journal.entryTitle')}
          placeholder={t('journal.entryTitlePlaceholder')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Select
          label={t('journal.mood')}
          options={moodOptions}
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />

        <Textarea
          label={t('journal.entryContent')}
          placeholder={t('journal.entryContentPlaceholder')}
          rows={12}
          className="font-light leading-relaxed text-foreground"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">{t('journal.tags')}</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="muted" className="cursor-pointer" onClick={() => setTags((p) => p.filter((t) => t !== tag))}>
                #{tag} ×
              </Badge>
            ))}
          </div>
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
            placeholder={t('journal.tagPlaceholder')}
            className="h-8 w-full rounded-md border border-border bg-input-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <button
          onClick={() => setIsPrivate((v) => !v)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {isPrivate ? <Lock size={14} className="text-primary" /> : <Unlock size={14} />}
          {isPrivate ? t('journal.privateLabel') : t('journal.publicLabel')}
        </button>
      </div>
    </div>
  );
}
