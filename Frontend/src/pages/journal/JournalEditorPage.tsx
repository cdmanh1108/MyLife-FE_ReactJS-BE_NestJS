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

// Backend mood enum: HAPPY | SAD | ANGRY | TIRED | PEACEFUL | LONELY | MOTIVATED | EMPTY | OTHER
const MOODS = [
  { value: '', label: '— Không có —' },
  { value: 'HAPPY', label: '😊 Vui vẻ' },
  { value: 'PEACEFUL', label: '😌 Yên bình' },
  { value: 'MOTIVATED', label: '🤩 Động lực' },
  { value: 'TIRED', label: '😫 Mệt mỏi' },
  { value: 'SAD', label: '😔 Buồn' },
  { value: 'LONELY', label: '🥺 Cô đơn' },
  { value: 'ANGRY', label: '😡 Tức giận' },
  { value: 'EMPTY', label: '😐 Trống rỗng' },
  { value: 'OTHER', label: '🤔 Khác' },
];

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

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setTags((prev) => [...new Set([...prev, tagInput.trim()])]);
      setTagInput('');
    }
  };

  const handleSave = () => {
    if (!content.trim()) { toast.error('Vui lòng nhập nội dung'); return; }
    createEntry.mutate(
      { title: title || undefined, content, mood: mood || undefined, tags, isPrivate },
      {
        onSuccess: () => {
          toast.success('Đã lưu nhật ký');
          navigate(ROUTES.JOURNAL);
        },
        onError: () => toast.error('Lỗi khi lưu nhật ký'),
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
          label="Tiêu đề (tùy chọn)"
          placeholder="Ngày hôm nay..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Select
          label={t('journal.mood')}
          options={MOODS}
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />

        <Textarea
          label="Nội dung"
          placeholder="Hôm nay tôi cảm thấy..."
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
            placeholder="Nhập tag và nhấn Enter..."
            className="h-8 w-full rounded-md border border-border bg-input-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <button
          onClick={() => setIsPrivate((v) => !v)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {isPrivate ? <Lock size={14} className="text-primary" /> : <Unlock size={14} />}
          {isPrivate ? 'Bài viết riêng tư' : 'Bài viết công khai'}
        </button>
      </div>
    </div>
  );
}
