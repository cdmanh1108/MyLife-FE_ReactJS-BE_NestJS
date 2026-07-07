import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, FileText, TrendingUp, Trash2 } from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button } from '@/shared/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { EmptyState } from '@/shared/ui/EmptyState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { formatDate } from '@/shared/lib/date';
import { useMockTests, useCreateMockTest, useDeleteMockTest } from '@/features/learning/api/useMockTests';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';

export default function MockTestsPage() {
  const { t } = useTranslation();
  const modal = useDisclosure();

  // Form states
  const [formLanguage, setFormLanguage] = useState<'IELTS' | 'TOPIK'>('TOPIK');
  
  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [formTestName, setFormTestName] = useState('');
  const [formTestDate, setFormTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [formListeningScore, setFormListeningScore] = useState('');
  const [formReadingScore, setFormReadingScore] = useState('');
  const [formWritingScore, setFormWritingScore] = useState('');
  const [formSpeakingScore, setFormSpeakingScore] = useState('');
  const [formTotalScore, setFormTotalScore] = useState('');
  const [formNote, setFormNote] = useState('');

  const { data: tests = [], isLoading, isError, refetch } = useMockTests();
  const createMutation = useCreateMockTest();
  const deleteMutation = useDeleteMockTest();

  const handleSave = () => {
    if (!formTestName.trim()) {
      toast.error(t('learning.toastEnterTestName'));
      return;
    }
    const payload = {
      language: formLanguage,
      testName: formTestName.trim(),
      testDate: new Date(formTestDate).toISOString(),
      listeningScore: formListeningScore ? Number(formListeningScore) : undefined,
      readingScore: formReadingScore ? Number(formReadingScore) : undefined,
      writingScore: formWritingScore ? Number(formWritingScore) : undefined,
      speakingScore: formSpeakingScore ? Number(formSpeakingScore) : undefined,
      totalScore: formTotalScore ? Number(formTotalScore) : undefined,
      note: formNote.trim() || undefined,
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success(t('learning.toastTestAdded'));
        modal.close();
        setFormTestName('');
        setFormListeningScore('');
        setFormReadingScore('');
        setFormWritingScore('');
        setFormSpeakingScore('');
        setFormTotalScore('');
        setFormNote('');
      },
      onError: () => toast.error(t('learning.toastTestAddError')),
    });
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={t('learning.errorLoadTests')} onRetry={refetch} />;

  const sortedTests = [...tests].sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime());
  const chartData = [...sortedTests].reverse().map((t) => ({
    name: formatDate(t.testDate, 'dd/MM'),
    score: t.totalScore ?? 0,
  }));

  const getMaxScoreLimit = () => {
    return formLanguage === 'TOPIK' ? 300 : 9;
  };

  return (
    <div className="space-y-5 animate-slide-up">
      <PageHeader
        title={t('nav.mockTests')}
        actions={<Button size="sm" onClick={modal.open}><Plus size={14} />{t('learning.addResult')}</Button>}
      />

      {sortedTests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp size={14} />{t('learning.scoreTrend')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1526', border: '1px solid rgba(56,189,248,0.1)', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#cbd5e1' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: '600' }}
                />
                <Line type="monotone" dataKey="score" stroke="#38bdf8" strokeWidth={2} dot={{ fill: '#38bdf8', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {sortedTests.length === 0 ? (
        <EmptyState
          icon={<FileText size={24} />}
          title={t('learning.noTestsRecorded')}
          action={<Button size="sm" onClick={modal.open}>{t('learning.addFirstResult')}</Button>}
        />
      ) : (
        <div className="space-y-2">
          {sortedTests.map((test) => {
            const maxScore = test.language === 'TOPIK' ? 300 : 9;
            return (
              <Card key={test.id} className="flex items-center gap-4 p-3 card-glow group relative bg-card">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{test.testName}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(test.testDate)}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="font-mono font-semibold text-primary">
                      {test.totalScore}
                      <span className="text-muted-foreground text-xs">/{maxScore}</span>
                    </p>
                    <Badge variant={test.language === 'TOPIK' ? 'info' : 'success'} className="text-[10px]">
                      {test.language}
                    </Badge>
                  </div>
                  <button
                    onClick={() => handleDelete(test.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-secondary/40 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title={t('learning.deleteResult')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modal.isOpen} onClose={modal.close} title={t('learning.addTestResult')}>
        <div className="space-y-4">
          <Select
            label={t('learning.studyLanguage')}
            options={[{ value: 'TOPIK', label: 'TOPIK' }, { value: 'IELTS', label: 'IELTS' }]}
            value={formLanguage}
            onChange={(e) => setFormLanguage(e.target.value as any)}
          />

          <Input label={t('learning.testName')} placeholder={t('learning.testNamePlaceholder')} value={formTestName} onChange={(e) => setFormTestName(e.target.value)} />
          <Input label={t('learning.testDate')} type="date" value={formTestDate} onChange={(e) => setFormTestDate(e.target.value)} />

          <div className="grid grid-cols-2 gap-4">
            <Input label={t('learning.scoreListening')} type="number" placeholder="0" value={formListeningScore} onChange={(e) => setFormListeningScore(e.target.value)} />
            <Input label={t('learning.scoreReading')} type="number" placeholder="0" value={formReadingScore} onChange={(e) => setFormReadingScore(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label={t('learning.scoreWriting')} type="number" placeholder="0" value={formWritingScore} onChange={(e) => setFormWritingScore(e.target.value)} />
            <Input label={t('learning.scoreSpeaking')} type="number" placeholder="0" value={formSpeakingScore} onChange={(e) => setFormSpeakingScore(e.target.value)} />
          </div>

          <Input
            label={`${t('learning.scoreTotal')} (${t('learning.maxScoreLimit')}: ${getMaxScoreLimit()})`}
            type="number"
            placeholder="0"
            value={formTotalScore}
            onChange={(e) => setFormTotalScore(e.target.value)}
          />

          <Input label={t('learning.additionalNotes')} placeholder={t('learning.testNotesPlaceholder')} value={formNote} onChange={(e) => setFormNote(e.target.value)} />

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
                toast.success(t('learning.toastTestDeleted'));
                setDeleteId(null);
              },
              onError: () => toast.error(t('learning.toastDeleteError')),
            });
          }
        }}
        title={t('learning.deleteTestTitle')}
        description={t('confirmations.deleteTest')}
        variant="danger"
        confirmText={t('common.delete')}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
