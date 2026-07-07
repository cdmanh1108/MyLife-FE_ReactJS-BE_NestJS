import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays, Plus, Trash2, Clock, Target } from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button } from '@/shared/ui/Button';
import { Card, CardContent } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { EmptyState } from '@/shared/ui/EmptyState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { formatDate } from '@/shared/lib/date';
import { useStudyPlans, useCreateStudyPlan, useDeleteStudyPlan } from '@/features/learning/api/useStudyPlans';
import { toast } from 'sonner';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';

export default function StudyPlanPage() {
  const { t } = useTranslation();
  const modal = useDisclosure();

  // Form states
  const [formLanguage, setFormLanguage] = useState<'IELTS' | 'TOPIK'>('TOPIK');
  const [formTitle, setFormTitle] = useState('');

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formDescription, setFormDescription] = useState('');
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [formEndDate, setFormEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [formTargetScore, setFormTargetScore] = useState('');
  const [formDailyMinutes, setFormDailyMinutes] = useState('30');
  const [formStatus, setFormStatus] = useState('ACTIVE');

  const { data: plans = [], isLoading, isError, refetch } = useStudyPlans();
  const createMutation = useCreateStudyPlan();
  const deleteMutation = useDeleteStudyPlan();

  const handleSave = () => {
    if (!formTitle.trim()) {
      toast.error(t('learning.toastEnterPlanTitle'));
      return;
    }
    const payload = {
      language: formLanguage,
      title: formTitle.trim(),
      description: formDescription.trim() || undefined,
      startDate: new Date(formStartDate).toISOString(),
      endDate: new Date(formEndDate).toISOString(),
      targetScore: formTargetScore.trim() || undefined,
      dailyMinutes: Number(formDailyMinutes) || 30,
      status: formStatus,
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success(t('learning.toastPlanAdded'));
        modal.close();
        setFormTitle('');
        setFormDescription('');
        setFormTargetScore('');
        setFormDailyMinutes('30');
        setFormStatus('ACTIVE');
      },
      onError: () => toast.error(t('learning.toastPlanAddError')),
    });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={t('learning.errorLoadPlans')} onRetry={refetch} />;

  return (
    <div className="space-y-5 animate-slide-up">
      <PageHeader
        title={t('nav.studyPlan')}
        actions={<Button size="sm" onClick={modal.open}><Plus size={14} />{t('learning.createPlan')}</Button>}
      />

      {plans.length === 0 ? (
        <EmptyState
          icon={<CalendarDays size={24} />}
          title={t('learning.noPlansRecorded')}
          action={<Button size="sm" onClick={modal.open}><Plus size={14} />{t('learning.createFirstPlan')}</Button>}
        />
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => (
            <Card key={plan.id} className="card-glow p-5 relative group">
              <button
                onClick={(e) => handleDelete(plan.id, e)}
                className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-destructive hover:bg-secondary/40 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                title={t('learning.deletePlan')}
              >
                <Trash2 size={14} />
              </button>

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-lg text-foreground">{plan.title}</p>
                    <Badge variant={plan.language === 'TOPIK' ? 'info' : 'success'}>
                      {plan.language}
                    </Badge>
                    <Badge variant={plan.status === 'ACTIVE' ? 'warning' : plan.status === 'COMPLETED' ? 'success' : 'muted'}>
                      {t('learning.status' + plan.status, plan.status)}
                    </Badge>
                  </div>
                  {plan.description && <p className="text-sm text-muted-foreground">{plan.description}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border/40 text-xs">
                <div className="space-y-1">
                  <p className="text-muted-foreground">{t('learning.studyTime')}</p>
                  <p className="font-medium text-foreground flex items-center gap-1.5">
                    <CalendarDays size={13} className="text-primary" />
                    {formatDate(plan.startDate)} — {formatDate(plan.endDate)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">{t('learning.dailyGoal')}</p>
                  <p className="font-medium text-foreground flex items-center gap-1.5">
                    <Clock size={13} className="text-primary" />
                    {t('learning.dailyMinutesCount', { minutes: plan.dailyMinutes ?? 30 })}
                  </p>
                </div>
                {plan.targetScore && (
                  <div className="space-y-1">
                    <p className="text-muted-foreground">{t('learning.targetScore')}</p>
                    <p className="font-medium text-foreground flex items-center gap-1.5 font-mono">
                      <Target size={13} className="text-primary" />
                      {plan.targetScore}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modal.isOpen} onClose={modal.close} title={t('learning.createPlanTitle')}>
        <div className="space-y-4">
          <Select
            label={t('learning.studyLanguage')}
            options={[{ value: 'TOPIK', label: 'TOPIK (Korean)' }, { value: 'IELTS', label: 'IELTS (English)' }]}
            value={formLanguage}
            onChange={(e) => setFormLanguage(e.target.value as any)}
          />

          <Input label={t('learning.planTitle')} placeholder={t('learning.planTitlePlaceholder')} value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
          <Input label={t('learning.planDescription')} placeholder={t('learning.planDescriptionPlaceholder')} value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('learning.planStartDate')} type="date" value={formStartDate} onChange={(e) => setFormStartDate(e.target.value)} />
            <Input label={t('learning.planEndDate')} type="date" value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label={t('learning.targetScoreLabel')} placeholder={t('learning.targetScorePlaceholder')} value={formTargetScore} onChange={(e) => setFormTargetScore(e.target.value)} />
            <Input label={t('learning.dailyDurationLabel')} type="number" value={formDailyMinutes} onChange={(e) => setFormDailyMinutes(e.target.value)} />
          </div>

          <Select
            label={t('learning.status')}
            options={[
              { value: 'ACTIVE', label: t('learning.statusACTIVE') },
              { value: 'PLANNED', label: t('learning.statusPLANNED') },
              { value: 'COMPLETED', label: t('learning.statusCOMPLETED') },
              { value: 'ABANDONED', label: t('learning.statusABANDONED') },
            ]}
            value={formStatus}
            onChange={(e) => setFormStatus(e.target.value)}
          />

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
                toast.success(t('learning.toastPlanDeleted'));
                setDeleteId(null);
              },
              onError: () => toast.error(t('learning.toastPlanDeleteError')),
            });
          }
        }}
        title={t('learning.deletePlanTitle')}
        description={t('confirmations.deletePlan')}
        variant="danger"
        confirmText={t('common.delete')}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
