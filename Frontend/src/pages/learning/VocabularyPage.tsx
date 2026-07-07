import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, CheckCircle2, Circle, Search } from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Card } from '@/shared/ui/Card';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { EmptyState } from '@/shared/ui/EmptyState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { useVocabulary, useCreateVocabulary, useUpdateVocabulary } from '@/features/learning/api/useVocabulary';
import { toast } from 'sonner';

export default function VocabularyPage() {
  const { t } = useTranslation();
  const modal = useDisclosure();
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState('all');

  // Form state
  const [formWord, setFormWord] = useState('');
  const [formMeaning, setFormMeaning] = useState('');
  const [formExample, setFormExample] = useState('');
  const [formLanguage, setFormLanguage] = useState<'IELTS' | 'TOPIK'>('TOPIK');
  const [formSkill, setFormSkill] = useState<string>('VOCABULARY');

  const params = {
    keyword: search || undefined,
    language: langFilter !== 'all' ? langFilter : undefined,
  };
  const { data: vocab = [], isLoading, isError, refetch } = useVocabulary(params);
  const createMutation = useCreateVocabulary();
  const updateMutation = useUpdateVocabulary();

  const handleToggleMastered = (id: string, mastered: boolean) => {
    updateMutation.mutate(
      { id, dto: { mastered: !mastered } },
      { onError: () => toast.error('Lỗi khi cập nhật') }
    );
  };

  const handleSave = () => {
    if (!formWord.trim() || !formMeaning.trim()) { toast.error('Vui lòng điền từ và nghĩa'); return; }
    createMutation.mutate(
      { word: formWord, meaning: formMeaning, example: formExample || undefined, language: formLanguage, skill: formSkill },
      {
        onSuccess: () => {
          toast.success('Đã thêm từ vựng');
          modal.close();
          setFormWord(''); setFormMeaning(''); setFormExample(''); setFormLanguage('TOPIK'); setFormSkill('VOCABULARY');
        },
        onError: () => toast.error('Lỗi khi thêm từ vựng'),
      }
    );
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message="Lỗi khi tải từ vựng" onRetry={refetch} />;

  return (
    <div className="space-y-5 animate-slide-up">
      <PageHeader
        title={t('learning.vocabulary')}
        actions={<Button size="sm" onClick={modal.open}><Plus size={14} />Thêm từ</Button>}
      />
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('common.search')}
            className="h-9 w-full rounded-md border border-border bg-input-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Select
          options={[{ value: 'all', label: 'Tất cả' }, { value: 'TOPIK', label: 'TOPIK' }, { value: 'IELTS', label: 'IELTS' }]}
          value={langFilter}
          onChange={(e) => setLangFilter(e.target.value)}
          className="w-32"
        />
      </div>

      {vocab.length === 0 ? (
        <EmptyState icon={<Plus size={24} />} title={t('learning.noVocab')} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {vocab.map((v) => {
            return (
              <Card key={v.id} className="card-glow space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground font-mono">{v.word}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{v.meaning}</p>
                  </div>
                  <button
                    onClick={() => handleToggleMastered(v.id, v.mastered)}
                    className="mt-0.5 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {v.mastered ? <CheckCircle2 size={16} className="text-green-400" /> : <Circle size={16} />}
                  </button>
                </div>
                {v.example && (
                  <p className="text-xs text-muted-foreground italic border-l-2 border-primary/20 pl-2">{v.example}</p>
                )}
                <div className="flex gap-1.5">
                  <Badge variant={v.language === 'TOPIK' ? 'info' : 'success'}>{v.language}</Badge>
                  {v.mastered && <Badge variant="success">Thuộc</Badge>}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modal.isOpen} onClose={modal.close} title="Thêm từ vựng">
        <div className="space-y-4">
          <Select
            label="Ngôn ngữ"
            options={[{ value: 'TOPIK', label: 'TOPIK (Korean)' }, { value: 'IELTS', label: 'IELTS (English)' }]}
            value={formLanguage}
            onChange={(e) => setFormLanguage(e.target.value as any)}
          />
          <Select
            label="Kỹ năng"
            options={[
              { value: 'VOCABULARY', label: 'Từ vựng' },
              { value: 'GRAMMAR', label: 'Ngữ pháp' },
              { value: 'LISTENING', label: 'Nghe' },
              { value: 'READING', label: 'Đọc' },
              { value: 'WRITING', label: 'Viết' },
              { value: 'SPEAKING', label: 'Nói' },
            ]}
            value={formSkill}
            onChange={(e) => setFormSkill(e.target.value)}
          />
          <Input label="Từ vựng" placeholder="열심히 / Meticulous..." value={formWord} onChange={(e) => setFormWord(e.target.value)} />
          <Input label="Nghĩa" placeholder="Chăm chỉ..." value={formMeaning} onChange={(e) => setFormMeaning(e.target.value)} />
          <Input label="Ví dụ" placeholder="Câu ví dụ..." value={formExample} onChange={(e) => setFormExample(e.target.value)} />
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" onClick={modal.close} fullWidth>{t('common.cancel')}</Button>
            <Button fullWidth onClick={handleSave} loading={createMutation.isPending}>{t('common.save')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
