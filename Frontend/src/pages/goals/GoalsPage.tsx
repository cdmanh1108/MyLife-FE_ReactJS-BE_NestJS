import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Target, CheckCircle2, Edit2, Trash2 } from 'lucide-react';
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
import { useGoals, useCreateGoal, useUpdateGoal, useDeleteGoal, useUpdateMilestone } from '@/features/goals/api/useGoals';
import { toast } from 'sonner';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';

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
  const confirmDelete = useDisclosure();
  const [activeGoal, setActiveGoal] = useState<any | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formTargetDate, setFormTargetDate] = useState('');
  const [formStatus, setFormStatus] = useState<string>('NOT_STARTED');

  const { data: goals = [], isLoading, isError, refetch } = useGoals();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();
  const updateMilestone = useUpdateMilestone();

  const handleAddClick = () => {
    setActiveGoal(null);
    setFormTitle('');
    setFormDesc('');
    setFormTargetDate('');
    setFormStatus('NOT_STARTED');
    modal.open();
  };

  const handleEditClick = (goal: any) => {
    setActiveGoal(goal);
    setFormTitle(goal.title);
    setFormDesc(goal.description || '');
    setFormTargetDate(goal.targetDate ? goal.targetDate.split('T')[0] : '');
    setFormStatus(goal.status);
    modal.open();
  };

  const handleDeleteClick = (id: string) => {
    setActiveGoal({ id });
    confirmDelete.open();
  };

  const handleSave = () => {
    if (!formTitle.trim()) {
      toast.error(t('goals.toastEnterTitle'));
      return;
    }

    const payload: any = {
      title: formTitle,
      description: formDesc || undefined,
      targetDate: formTargetDate || undefined,
    };

    if (activeGoal && activeGoal.id) {
      payload.status = formStatus;
      updateGoal.mutate(
        {
          id: activeGoal.id,
          dto: payload,
        },
        {
          onSuccess: () => {
            toast.success(t('goals.toastUpdateSuccess'));
            modal.close();
            setActiveGoal(null);
          },
          onError: () => toast.error(t('goals.toastUpdateError')),
        }
      );
    } else {
      createGoal.mutate(payload, {
        onSuccess: () => {
          toast.success(t('goals.toastCreateSuccess'));
          modal.close();
        },
        onError: () => toast.error(t('goals.toastCreateError')),
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!activeGoal || !activeGoal.id) return;

    deleteGoal.mutate(activeGoal.id, {
      onSuccess: () => {
        toast.success(t('goals.toastDeleteSuccess'));
        confirmDelete.close();
        setActiveGoal(null);
      },
      onError: () => toast.error(t('goals.toastDeleteError')),
    });
  };

  const handleToggleMilestone = (goalId: string, milestoneId: string, completed: boolean) => {
    updateMilestone.mutate(
      { goalId, milestoneId, dto: { completed: !completed } },
      { onError: () => toast.error(t('goals.toastUpdateMilestoneError')) }
    );
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={t('goals.errorLoad')} onRetry={refetch} />;

  return (
    <div className="space-y-5 animate-slide-up">
      <PageHeader
        title={t('goals.title')}
        actions={
          <Button size="sm" onClick={handleAddClick}>
            <Plus size={14} />
            {t('goals.addGoal')}
          </Button>
        }
      />
      {goals.length === 0 ? (
        <EmptyState
          icon={<Target size={24} />}
          title={t('goals.noGoals')}
          action={
            <Button size="sm" onClick={handleAddClick}>
              <Plus size={14} />
              {t('goals.createFirstGoal')}
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {goals.map((goal) => {
            const statusCfg = STATUS_CONFIG[goal.status] ?? STATUS_CONFIG.IN_PROGRESS;
            return (
              <Card key={goal.id} className="card-glow space-y-4 relative group">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground pr-16 break-words">{goal.title}</h3>
                    {goal.description && <p className="text-xs text-muted-foreground mt-0.5 break-words">{goal.description}</p>}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant={statusCfg.variant}>{t(statusCfg.labelKey)}</Badge>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditClick(goal)}
                        className="p-1 text-muted-foreground hover:text-primary hover:bg-secondary/40 rounded-md transition-colors cursor-pointer"
                        title={t('common.edit')}
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(goal.id)}
                        className="p-1 text-muted-foreground hover:text-destructive hover:bg-secondary/40 rounded-md transition-colors cursor-pointer"
                        title={t('common.delete')}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="text-muted-foreground">{t('goals.progress')}</span>
                    <span className="font-mono text-primary">{goal.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-700"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
                {goal.milestones?.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('goals.milestones')}</p>
                    {goal.milestones.map((m) => (
                      <button
                        key={m.id}
                        className="flex items-center gap-2 w-full text-left cursor-pointer"
                        onClick={() => handleToggleMilestone(goal.id, m.id, m.completed)}
                      >
                        <CheckCircle2 size={13} className={m.completed ? 'text-green-400' : 'text-muted-foreground/30'} />
                        <span className={`text-xs break-words ${m.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                          {m.title}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {goal.targetDate && (
                  <p className="text-[10px] text-muted-foreground">
                    {t('goals.targetDate')}: {formatDate(goal.targetDate)}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Goal Add / Edit Modal */}
      <Modal open={modal.isOpen} onClose={modal.close} title={activeGoal ? t('goals.editGoal') : t('goals.addGoal')}>
        <div className="space-y-4">
          <Input
            label={t('goals.goalTitle')}
            placeholder={t('goals.goalTitlePlaceholder')}
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
          <Input
            label={t('goals.goalDescription')}
            placeholder={t('goals.goalDescriptionPlaceholder')}
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
          />
          <Input
            label={t('goals.targetDate')}
            type="date"
            value={formTargetDate}
            onChange={(e) => setFormTargetDate(e.target.value)}
          />

          {activeGoal && (
            <Select
              label={t('goals.status')}
              options={[
                { value: 'NOT_STARTED', label: t('goals.statusNotStarted') },
                { value: 'IN_PROGRESS', label: t('goals.statusInProgress') },
                { value: 'COMPLETED', label: t('goals.statusCompleted') },
                { value: 'PAUSED', label: t('goals.statusPaused') },
                { value: 'CANCELLED', label: t('goals.statusCancelled') },
              ]}
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value as any)}
            />
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="ghost" onClick={modal.close} fullWidth>
              {t('common.cancel')}
            </Button>
            <Button fullWidth onClick={handleSave} loading={createGoal.isPending || updateGoal.isPending}>
              {t('common.save')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={confirmDelete.isOpen}
        onClose={confirmDelete.close}
        onConfirm={handleDeleteConfirm}
        title={t('goals.confirmDeleteTitle')}
        description={t('goals.confirmDeleteMessage')}
        variant="danger"
        loading={deleteGoal.isPending}
      />
    </div>
  );
}
