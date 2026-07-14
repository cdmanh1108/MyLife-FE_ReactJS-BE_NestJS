import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, CheckCircle2, Circle, Search, Edit2, Trash2 } from 'lucide-react';
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
import { useVocabulary, useCreateVocabulary, useUpdateVocabulary, useDeleteVocabulary } from '@/features/learning/api/useVocabulary';
import { toast } from 'sonner';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';

export default function VocabularyPage() {
  const { t } = useTranslation();
  const modal = useDisclosure();
  const confirmDelete = useDisclosure();
  const [activeVocab, setActiveVocab] = useState<any | null>(null);

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
  const deleteMutation = useDeleteVocabulary();

  const handleAddClick = () => {
    setActiveVocab(null);
    setFormWord('');
    setFormMeaning('');
    setFormExample('');
    setFormLanguage('TOPIK');
    setFormSkill('VOCABULARY');
    modal.open();
  };

  const handleEditClick = (v: any) => {
    setActiveVocab(v);
    setFormWord(v.word);
    setFormMeaning(v.meaning);
    setFormExample(v.example || '');
    setFormLanguage(v.language);
    setFormSkill(v.skill || 'VOCABULARY');
    modal.open();
  };

  const handleDeleteClick = (v: any) => {
    setActiveVocab(v);
    confirmDelete.open();
  };

  const handleToggleMastered = (id: string, mastered: boolean) => {
    updateMutation.mutate(
      { id, dto: { mastered: !mastered } },
      { onError: () => toast.error(t('learning.toastUpdateError')) }
    );
  };

  const handleSave = () => {
    if (!formWord.trim() || !formMeaning.trim()) {
      toast.error(t('learning.toastFillWordAndMeaning'));
      return;
    }

    const payload: any = {
      word: formWord.trim(),
      meaning: formMeaning.trim(),
      example: formExample.trim() || undefined,
      language: formLanguage,
      skill: formSkill,
    };

    if (activeVocab && activeVocab.id) {
      updateMutation.mutate(
        { id: activeVocab.id, dto: payload },
        {
          onSuccess: () => {
            toast.success(t('learning.toastVocabUpdated'));
            modal.close();
            setActiveVocab(null);
          },
          onError: () => toast.error(t('learning.toastUpdateError')),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success(t('learning.toastVocabAdded'));
          modal.close();
        },
        onError: () => toast.error(t('learning.toastVocabAddError')),
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!activeVocab || !activeVocab.id) return;
    deleteMutation.mutate(activeVocab.id, {
      onSuccess: () => {
        toast.success(t('learning.toastVocabDeleted'));
        confirmDelete.close();
        setActiveVocab(null);
      },
      onError: () => toast.error(t('learning.toastVocabDeleteError')),
    });
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={t('learning.errorLoadVocab')} onRetry={refetch} />;

  return (
    <div className="space-y-5 animate-slide-up">
      <PageHeader
        title={t('learning.vocabulary')}
        actions={
          <Button size="sm" onClick={handleAddClick}>
            <Plus size={14} />
            {t('learning.addWord')}
          </Button>
        }
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
          options={[
            { value: 'all', label: t('common.all') },
            { value: 'TOPIK', label: 'TOPIK' },
            { value: 'IELTS', label: 'IELTS' },
          ]}
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
              <Card key={v.id} className="card-glow space-y-2 group relative">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground font-mono break-words">{v.word}</p>
                    <p className="text-sm text-muted-foreground mt-0.5 break-words">{v.meaning}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleToggleMastered(v.id, v.mastered)}
                      className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      {v.mastered ? <CheckCircle2 size={16} className="text-green-400" /> : <Circle size={16} />}
                    </button>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditClick(v)}
                        className="p-1 text-muted-foreground hover:text-primary hover:bg-secondary/40 rounded-md transition-colors cursor-pointer"
                        title={t('common.edit')}
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(v)}
                        className="p-1 text-muted-foreground hover:text-destructive hover:bg-secondary/40 rounded-md transition-colors cursor-pointer"
                        title={t('common.delete')}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
                {v.example && (
                  <p className="text-xs text-muted-foreground italic border-l-2 border-primary/20 pl-2 break-words">
                    {v.example}
                  </p>
                )}
                <div className="flex gap-1.5">
                  <Badge variant={v.language === 'TOPIK' ? 'info' : 'success'}>{v.language}</Badge>
                  {v.mastered && <Badge variant="success">{t('learning.mastered')}</Badge>}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modal.isOpen} onClose={modal.close} title={activeVocab ? t('learning.editVocab') : t('learning.addVocab')}>
        <div className="space-y-4">
          <Select
            label={t('learning.studyLanguage')}
            options={[
              { value: 'TOPIK', label: 'TOPIK (Korean)' },
              { value: 'IELTS', label: 'IELTS (English)' },
            ]}
            value={formLanguage}
            onChange={(e) => setFormLanguage(e.target.value as any)}
          />
          <Select
            label={t('learning.studySkill')}
            options={[
              { value: 'VOCABULARY', label: t('learning.skillVocabulary') },
              { value: 'GRAMMAR', label: t('learning.skillGrammar') },
              { value: 'LISTENING', label: t('learning.skillListening') },
              { value: 'READING', label: t('learning.skillReading') },
              { value: 'WRITING', label: t('learning.skillWriting') },
              { value: 'SPEAKING', label: t('learning.skillSpeaking') },
            ]}
            value={formSkill}
            onChange={(e) => setFormSkill(e.target.value)}
          />
          <Input
            label={t('learning.vocabWord')}
            placeholder={t('learning.vocabWordPlaceholder')}
            value={formWord}
            onChange={(e) => setFormWord(e.target.value)}
          />
          <Input
            label={t('learning.vocabMeaning')}
            placeholder={t('learning.vocabMeaningPlaceholder')}
            value={formMeaning}
            onChange={(e) => setFormMeaning(e.target.value)}
          />
          <Input
            label={t('learning.vocabExample')}
            placeholder={t('learning.vocabExamplePlaceholder')}
            value={formExample}
            onChange={(e) => setFormExample(e.target.value)}
          />
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" onClick={modal.close} fullWidth>
              {t('common.cancel')}
            </Button>
            <Button fullWidth onClick={handleSave} loading={createMutation.isPending || updateMutation.isPending}>
              {t('common.save')}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={confirmDelete.isOpen}
        onClose={confirmDelete.close}
        onConfirm={handleDeleteConfirm}
        title={t('learning.confirmDeleteVocabTitle')}
        description={t('learning.confirmDeleteVocabMessage')}
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
