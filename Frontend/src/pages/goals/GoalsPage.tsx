import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Target, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { EmptyState } from '@/shared/ui/EmptyState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { formatDate } from '@/shared/lib/date';
import { useGoals, useCreateGoal, useUpdateMilestone } from '@/features/goals/api/useGoals';
import { toast } from 'sonner';

// Backend: NOT_STARTED | IN_PROGRESS | COMPLETED | PAUSED | CANCELLED
const STATUS_CONFIG: Record<string, { labelKey: string; variant: 'info' | 'success' | 'warning' | 'muted' | 'danger' }> = {
  NOT_STARTED: { labelKey: 'goals.statusNotStarted', variant: 'muted' },
  IN_PROGRESS: { labelKey: 'goals.statusInProgress', variant: 'info' },
  COMPLETED: { labelKey: 'goals.statusCompleted', variant: 'success' },
  PAUSED: { labelKey: 'goals.statusPaused', variant: 'warning' },
  CANCELLED: { labelKey: 'goals.statusCancelled', variant: 'danger' },
  // Legacy fallback
  ACTIVE: { labelKey: 'goals.statusInProgress', variant: 'info' },
  ABANDONED: { labelKey: 'goals.statusCancelled', variant: 'muted' },
};

export default function GoalsPage() {
  const { t } = useTranslation();
  const modal = useDisclosure();
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formTargetDate, setFormTargetDate] = useState('');

  const { data: goals = [], isLoading, isError, refetch } = useGoals();
  const createGoal = useCreateGoal();
  const updateMilestone = useUpdateMilestone();

  const handleSave = () => {
    if (!formTitle.trim()) { toast.error(t('goals.toastEnterTitle')); return; }
    createGoal.mutate(
      { title: formTitle, description: formDesc || undefined, targetDate: formTargetDate || undefined },
      {
        onSuccess: () => {
          toast.success(t('goals.toastCreateSuccess'));
          modal.close();
          setFormTitle(''); setFormDesc(''); setFormTargetDate('');
        },
        onError: () => toast.error(t('goals.toastCreateError')),
      }
    );
  };

  const handleToggleMilestone = (goalId: string, milestoneId: string, done: boolean) => {
    updateMilestone.mutate(
      { goalId, milestoneId, dto: { done: !done } },
      { onError: () => toast.error(t('goals.toastUpdateMilestoneError')) }
    );
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={t('goals.errorLoad')} onRetry={refetch} />;

  return (
    <div className="space-y-5 animate-slide-up">
      <PageHeader
        title={t('goals.title')}
        actions={<Button size="sm" onClick={modal.open}><Plus size={14} />{t('goals.addGoal')}</Button>}
      />
      {goals.length === 0 ? (
        <EmptyState
          icon={<Target size={24} />}
          title={t('goals.noGoals')}
          action={<Button size="sm" onClick={modal.open}><Plus size={14} />{t('goals.createFirstGoal')}</Button>}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {goals.map((goal) => {
            const statusCfg = STATUS_CONFIG[goal.status] ?? STATUS_CONFIG.IN_PROGRESS;
            return (
              <Card key={goal.id} className="card-glow space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{goal.title}</h3>
                    {goal.description && <p className="text-xs text-muted-foreground mt-0.5">{goal.description}</p>}
                  </div>
                  <Badge variant={statusCfg.variant}>{t(statusCfg.labelKey)}</Badge>
                </div>
                <div>
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="text-muted-foreground">{t('goals.progress')}</span>
                    <span className="font-mono text-primary">{goal.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${goal.progress}%` }} />
                  </div>
                </div>
                {goal.milestones?.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('goals.milestones')}</p>
                    {goal.milestones.map((m) => (
                      <button
                        key={m.id}
                        className="flex items-center gap-2 w-full text-left"
                        onClick={() => handleToggleMilestone(goal.id, m.id, m.done)}
                      >
                        <CheckCircle2 size={13} className={m.done ? 'text-green-400' : 'text-muted-foreground/30'} />
                        <span className={`text-xs ${m.done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{m.title}</span>
                      </button>
                    ))}
                  </div>
                )}
                {goal.targetDate && (
                  <p className="text-[10px] text-muted-foreground">{t('goals.targetDate')}: {formatDate(goal.targetDate)}</p>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modal.isOpen} onClose={modal.close} title={t('goals.addGoal')}>
        <div className="space-y-4">
          <Input label={t('goals.goalTitle')} placeholder={t('goals.goalTitlePlaceholder')} value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
          <Input label={t('goals.goalDescription')} placeholder={t('goals.goalDescriptionPlaceholder')} value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
          <Input label={t('goals.targetDate')} type="date" value={formTargetDate} onChange={(e) => setFormTargetDate(e.target.value)} />
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" onClick={modal.close} fullWidth>{t('common.cancel')}</Button>
            <Button fullWidth onClick={handleSave} loading={createGoal.isPending}>{t('common.save')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
