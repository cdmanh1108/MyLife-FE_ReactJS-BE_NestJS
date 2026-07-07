import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Flame, BookText, FlaskConical, FileText, CalendarDays, ArrowRight, Plus, Clock } from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { StatCard } from '@/shared/ui/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { LoadingState } from '@/shared/ui/LoadingState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { ROUTES } from '@/shared/constants/routes';
import { useVocabulary } from '@/features/learning/api/useVocabulary';
import { useFlashcards } from '@/features/learning/api/useFlashcards';
import { useMockTests } from '@/features/learning/api/useMockTests';
import { useStudyPlans } from '@/features/learning/api/useStudyPlans';
import { useStudyLogs, useCreateStudyLog, useLearningStats } from '@/features/learning/api/useStudyLogs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

export default function LearningDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const modal = useDisclosure();

  // Log form states
  const [formLanguage, setFormLanguage] = useState<'IELTS' | 'TOPIK'>('TOPIK');
  const [formSkill, setFormSkill] = useState<'LISTENING' | 'READING' | 'WRITING' | 'SPEAKING' | 'VOCABULARY' | 'GRAMMAR'>('VOCABULARY');
  const [formMinutes, setFormMinutes] = useState('30');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formNote, setFormNote] = useState('');

  // Queries
  const { data: vocab = [], isLoading: loadV } = useVocabulary();
  const { data: flashcards = [], isLoading: loadF } = useFlashcards();
  const { data: mockTests = [], isLoading: loadM } = useMockTests();
  const { data: plans = [], isLoading: loadP } = useStudyPlans();
  const { data: logs = [], isLoading: loadL } = useStudyLogs();
  const { data: stats, isLoading: loadS } = useLearningStats();

  const createLogMutation = useCreateStudyLog();

  const handleLogSave = () => {
    if (!formMinutes || Number(formMinutes) <= 0) {
      toast.error('Vui lòng nhập thời lượng học hợp lệ');
      return;
    }
    createLogMutation.mutate(
      {
        language: formLanguage,
        skill: formSkill,
        minutes: Number(formMinutes),
        studiedAt: new Date(formDate).toISOString(),
        note: formNote.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Đã ghi nhận giờ học');
          modal.close();
          setFormMinutes('30');
          setFormNote('');
        },
        onError: () => toast.error('Lỗi khi ghi nhận giờ học'),
      }
    );
  };

  if (loadV || loadF || loadM || loadP || loadL || loadS) {
    return <LoadingState />;
  }

  // Calculate statistics
  const streak = stats?.learningStreak ?? 0;
  const totalVocabCount = vocab.length;
  const totalFlashcardsCount = flashcards.length;

  const mockTestHigh = mockTests.reduce((max, t) => {
    const val = t.totalScore ?? 0;
    return val > max ? val : max;
  }, 0);

  // Group study logs by last 7 days for the chart
  const getLast7Days = () => {
    const days = [];
    const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      const dayLabel = weekdays[d.getDay()];
      days.push({ dateString, label: dayLabel, minutes: 0 });
    }
    return days;
  };

  const chartData = getLast7Days();
  logs.forEach((log) => {
    const logDate = new Date(log.studiedAt).toISOString().split('T')[0];
    const item = chartData.find((d) => d.dateString === logDate);
    if (item) {
      item.minutes += log.minutes;
    }
  });

  const totalMinutesThisWeek = chartData.reduce((sum, d) => sum + d.minutes, 0);
  const totalHoursThisWeek = (totalMinutesThisWeek / 60).toFixed(1);

  const modules = [
    { label: 'Từ vựng', icon: <BookText size={16} />, to: ROUTES.LEARNING_VOCABULARY, count: `${totalVocabCount} từ`, badge: 'IELTS / TOPIK' },
    { label: 'Flashcards', icon: <FlaskConical size={16} />, to: ROUTES.LEARNING_FLASHCARDS, count: `${totalFlashcardsCount} thẻ`, badge: 'Sẵn sàng' },
    { label: 'Đề thi', icon: <FileText size={16} />, to: ROUTES.LEARNING_MOCK_TESTS, count: `${mockTests.length} lần thi`, badge: mockTestHigh > 0 ? `Max: ${mockTestHigh}đ` : 'Chưa thi' },
    { label: 'Kế hoạch', icon: <CalendarDays size={16} />, to: ROUTES.LEARNING_STUDY_PLAN, count: `${plans.filter(p => p.status === 'ACTIVE').length} đang chạy`, badge: plans.length > 0 ? 'On track' : 'Chưa có' },
  ];

  return (
    <div className="space-y-5 animate-slide-up">
      <PageHeader
        title={t('learning.title')}
        actions={<Button size="sm" onClick={modal.open}><Plus size={14} />Ghi nhận giờ học</Button>}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label={t('learning.streak')} value={streak.toString()} subValue={`${t('learning.days')}`} icon={<Flame size={18} />} variant="warning" />
        <StatCard label="Tổng từ vựng" value={totalVocabCount.toString()} subValue="IELTS & TOPIK" icon={<BookText size={18} />} />
        <StatCard label="Điểm thi cao nhất" value={mockTestHigh > 0 ? mockTestHigh.toString() : '—'} subValue="Thi thử Mock Test" icon={<FileText size={18} />} variant={mockTestHigh > 0 ? 'income' : 'default'} />
        <StatCard label="Thời lượng tuần này" value={`${totalHoursThisWeek}h`} subValue="7 ngày gần nhất" icon={<Clock size={18} />} variant="default" />
      </div>

      <Card>
        <CardHeader><CardTitle>Thời gian học 7 ngày qua</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0d1526', border: '1px solid rgba(56,189,248,0.1)', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#cbd5e1' }}
                labelStyle={{ color: '#f8fafc', fontWeight: '600' }}
                formatter={(v) => [`${v} phút`, 'Thời gian học']}
              />
              <Bar dataKey="minutes" fill="#38bdf8" radius={[4, 4, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {modules.map((m) => (
          <Card key={m.label} className="card-glow cursor-pointer" onClick={() => navigate(m.to)}>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">{m.icon}</div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{m.label}</p>
                <p className="text-xs text-muted-foreground">{m.count}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="info">{m.badge}</Badge>
                <ArrowRight size={14} className="text-muted-foreground" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={modal.isOpen} onClose={modal.close} title="Ghi nhận thời lượng tự học">
        <div className="space-y-4">
          <Select
            label="Ngôn ngữ học"
            options={[{ value: 'TOPIK', label: 'TOPIK (Korean)' }, { value: 'IELTS', label: 'IELTS (English)' }]}
            value={formLanguage}
            onChange={(e) => setFormLanguage(e.target.value as any)}
          />

          <Select
            label="Kỹ năng ôn luyện"
            options={[
              { value: 'VOCABULARY', label: 'Từ vựng (Vocabulary)' },
              { value: 'GRAMMAR', label: 'Ngữ pháp (Grammar)' },
              { value: 'LISTENING', label: 'Luyện nghe (Listening)' },
              { value: 'READING', label: 'Luyện đọc (Reading)' },
              { value: 'WRITING', label: 'Luyện viết (Writing)' },
              { value: 'SPEAKING', label: 'Luyện nói (Speaking)' },
            ]}
            value={formSkill}
            onChange={(e) => setFormSkill(e.target.value as any)}
          />

          <Input label="Thời gian học (phút)" type="number" value={formMinutes} onChange={(e) => setFormMinutes(e.target.value)} />
          <Input label="Ngày thực hiện" type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
          <Input label="Ghi chú thêm" placeholder="Ví dụ: Đọc hết bài viết số 3..." value={formNote} onChange={(e) => setFormNote(e.target.value)} />

          <div className="flex gap-2 pt-2">
            <Button variant="ghost" onClick={modal.close} fullWidth>{t('common.cancel')}</Button>
            <Button fullWidth onClick={handleLogSave} loading={createLogMutation.isPending}>{t('common.save')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
