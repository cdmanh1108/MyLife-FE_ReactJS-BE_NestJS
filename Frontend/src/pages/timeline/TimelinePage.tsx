import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Briefcase, GraduationCap, Code2, Star, Heart, Trash2 } from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Card } from '@/shared/ui/Card';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Textarea } from '@/shared/ui/Textarea';
import { EmptyState } from '@/shared/ui/EmptyState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { formatDate } from '@/shared/lib/date';
import { cn } from '@/shared/lib/cn';
import { useTimelineEvents, useCreateTimelineEvent, useDeleteTimelineEvent } from '@/features/timeline/api/useTimelineEvents';
import { toast } from 'sonner';
import type { TimelineEventType } from '@/types';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';

const typeConfig: Record<TimelineEventType, { icon: React.ReactNode; color: string; labelKey: string }> = {
  EDUCATION: { icon: <GraduationCap size={14} />, color: 'bg-blue-500/15 text-blue-400 border-blue-500/25', labelKey: 'timeline.typeEducation' },
  WORK: { icon: <Briefcase size={14} />, color: 'bg-purple-500/15 text-purple-400 border-purple-500/25', labelKey: 'timeline.typeWork' },
  PROJECT: { icon: <Code2 size={14} />, color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25', labelKey: 'timeline.typeProject' },
  MILESTONE: { icon: <Star size={14} />, color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25', labelKey: 'timeline.typeMilestone' },
  MEMORY: { icon: <Heart size={14} />, color: 'bg-pink-500/15 text-pink-400 border-pink-500/25', labelKey: 'timeline.typeMemory' },
};

export default function TimelinePage() {
  const { t } = useTranslation();
  const modal = useDisclosure();

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formType, setFormType] = useState<TimelineEventType>('MILESTONE');

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: events = [], isLoading, isError, refetch } = useTimelineEvents();
  const createMutation = useCreateTimelineEvent();
  const deleteMutation = useDeleteTimelineEvent();

  const handleSave = () => {
    if (!formTitle.trim()) {
      toast.error(t('timeline.toastEnterTitle'));
      return;
    }
    createMutation.mutate(
      {
        title: formTitle.trim(),
        description: formDescription.trim() || undefined,
        eventDate: new Date(formDate).toISOString(),
        type: formType,
      },
      {
        onSuccess: () => {
          toast.success(t('timeline.toastCreateSuccess'));
          modal.close();
          setFormTitle('');
          setFormDescription('');
          setFormDate(new Date().toISOString().split('T')[0]);
          setFormType('MILESTONE');
        },
        onError: () => toast.error(t('timeline.toastCreateError')),
      }
    );
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={t('timeline.errorLoad')} onRetry={refetch} />;

  const sorted = [...events].sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());

  return (
    <div className="space-y-6 animate-slide-up">
      <PageHeader
        title={t('timeline.title')}
        actions={<Button size="sm" onClick={modal.open}><Plus size={14} />{t('timeline.addEvent')}</Button>}
      />

      {sorted.length === 0 ? (
        <EmptyState
          icon={<Star size={24} />}
          title={t('timeline.noEvents')}
          action={<Button size="sm" onClick={modal.open}><Plus size={14} />{t('timeline.createFirstEvent')}</Button>}
        />
      ) : (
        <div className="relative pl-8">
          {/* Vertical line */}
          <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-border to-transparent" />
          <div className="space-y-8">
            {sorted.map((event, i) => {
              const config = typeConfig[event.type] ?? typeConfig.MILESTONE;
              return (
                <div key={event.id} className="relative animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                  {/* Dot */}
                  <div className={cn('absolute -left-[21px] flex size-6 items-center justify-center rounded-full border bg-background', config.color)}>
                    {config.icon}
                  </div>
                  {/* Content */}
                  <div className="group rounded-xl border border-border bg-card p-4 card-glow ml-2 relative">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{event.title}</h3>
                      <div className="flex items-center gap-2">
                         <span className="text-xs text-muted-foreground font-mono flex-shrink-0">
                          {formatDate(event.eventDate, 'MM/yyyy')}
                        </span>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity size-6 flex items-center justify-center rounded-md hover:bg-secondary"
                          title={t('common.delete')}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    {event.description && <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>}
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant="muted">{t(config.labelKey)}</Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(event.eventDate)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Modal open={modal.isOpen} onClose={modal.close} title={t('timeline.addEvent')}>
        <div className="space-y-4">
          <Input label={t('timeline.eventTitle')} placeholder={t('timeline.eventTitlePlaceholder')} value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
          
          <Select
            label={t('timeline.eventType')}
            options={[
              { value: 'MILESTONE', label: t('timeline.typeMilestone') },
              { value: 'WORK', label: t('timeline.typeWork') },
              { value: 'EDUCATION', label: t('timeline.typeEducation') },
              { value: 'PROJECT', label: t('timeline.typeProject') },
              { value: 'MEMORY', label: t('timeline.typeMemory') },
            ]}
            value={formType}
            onChange={(e) => setFormType(e.target.value as TimelineEventType)}
          />

          <Input label={t('timeline.eventDate')} type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />

          <Textarea
            label={t('timeline.eventDescription')}
            placeholder={t('timeline.eventDescriptionPlaceholder')}
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
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
                toast.success(t('timeline.toastDeleteSuccess'));
                setDeleteId(null);
              },
              onError: () => toast.error(t('timeline.toastDeleteError')),
            });
          }
        }}
        title={t('timeline.deleteEventTitle')}
        description={t('confirmations.deleteEvent')}
        variant="danger"
        confirmText={t('common.delete')}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
