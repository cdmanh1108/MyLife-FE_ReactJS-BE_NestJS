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

const typeConfig: Record<TimelineEventType, { icon: React.ReactNode; color: string; label: string }> = {
  EDUCATION: { icon: <GraduationCap size={14} />, color: 'bg-blue-500/15 text-blue-400 border-blue-500/25', label: 'Học tập' },
  WORK: { icon: <Briefcase size={14} />, color: 'bg-purple-500/15 text-purple-400 border-purple-500/25', label: 'Công việc' },
  PROJECT: { icon: <Code2 size={14} />, color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25', label: 'Dự án' },
  MILESTONE: { icon: <Star size={14} />, color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25', label: 'Mốc quan trọng' },
  MEMORY: { icon: <Heart size={14} />, color: 'bg-pink-500/15 text-pink-400 border-pink-500/25', label: 'Kỷ niệm' },
};

export default function TimelinePage() {
  const { t } = useTranslation();
  const modal = useDisclosure();

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formType, setFormType] = useState<TimelineEventType>('MILESTONE');

  const { data: events = [], isLoading, isError, refetch } = useTimelineEvents();
  const createMutation = useCreateTimelineEvent();
  const deleteMutation = useDeleteTimelineEvent();

  const handleSave = () => {
    if (!formTitle.trim()) {
      toast.error('Vui lòng nhập tiêu đề sự kiện');
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
          toast.success('Đã thêm sự kiện dòng thời gian');
          modal.close();
          setFormTitle('');
          setFormDescription('');
          setFormDate(new Date().toISOString().split('T')[0]);
          setFormType('MILESTONE');
        },
        onError: () => toast.error('Lỗi khi thêm sự kiện'),
      }
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success('Đã xóa sự kiện'),
        onError: () => toast.error('Lỗi khi xóa sự kiện'),
      });
    }
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message="Lỗi khi tải dòng thời gian" onRetry={refetch} />;

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
          action={<Button size="sm" onClick={modal.open}><Plus size={14} />Tạo sự kiện đầu tiên</Button>}
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
                          title="Xóa sự kiện"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    {event.description && <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>}
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant="muted">{config.label}</Badge>
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
          <Input label="Tiêu đề" placeholder="Tên cột mốc / công việc..." value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
          
          <Select
            label="Loại sự kiện"
            options={[
              { value: 'MILESTONE', label: 'Mốc quan trọng' },
              { value: 'WORK', label: 'Công việc' },
              { value: 'EDUCATION', label: 'Học tập' },
              { value: 'PROJECT', label: 'Dự án' },
              { value: 'MEMORY', label: 'Kỷ niệm' },
            ]}
            value={formType}
            onChange={(e) => setFormType(e.target.value as TimelineEventType)}
          />

          <Input label="Ngày diễn ra" type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />

          <Textarea
            label="Mô tả chi tiết"
            placeholder="Nội dung cột mốc..."
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          />

          <div className="flex gap-2 pt-2">
            <Button variant="ghost" onClick={modal.close} fullWidth>{t('common.cancel')}</Button>
            <Button fullWidth onClick={handleSave} loading={createMutation.isPending}>{t('common.save')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
