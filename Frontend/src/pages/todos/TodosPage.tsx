import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Circle, CheckCircle2, Clock } from 'lucide-react';
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
import { formatDate } from '@/shared/lib/date';
import { cn } from '@/shared/lib/cn';
import { useTodos, useCreateTodo, useCompleteTodo, useReopenTodo } from '@/features/todos/api/useTodos';
import { toast } from 'sonner';

// Backend: LOW | MEDIUM | HIGH | URGENT
const priorityConfig: Record<string, { label: string; variant: 'danger' | 'warning' | 'info' | 'muted'; color: string }> = {
  URGENT: { label: 'Khẩn cấp', variant: 'danger', color: 'border-l-red-500' },
  HIGH: { label: 'Cao', variant: 'warning', color: 'border-l-yellow-500' },
  MEDIUM: { label: 'Bình thường', variant: 'info', color: 'border-l-primary' },
  LOW: { label: 'Thấp', variant: 'muted', color: 'border-l-border' },
};

export default function TodosPage() {
  const { t } = useTranslation();
  const modal = useDisclosure();
  const [formTitle, setFormTitle] = useState('');
  const [formPriority, setFormPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [formDueDate, setFormDueDate] = useState('');

  const { data: todos = [], isLoading, isError, refetch } = useTodos();
  const createMutation = useCreateTodo();
  const completeMutation = useCompleteTodo();
  const reopenMutation = useReopenTodo();

  const handleToggle = (id: string, status: string) => {
    if (status === 'DONE') {
      reopenMutation.mutate(id, { onError: () => toast.error('Lỗi khi mở lại task') });
    } else {
      completeMutation.mutate(id, { onError: () => toast.error('Lỗi khi hoàn thành task') });
    }
  };

  const handleSave = () => {
    if (!formTitle.trim()) { toast.error('Vui lòng nhập tiêu đề'); return; }
    createMutation.mutate(
      { title: formTitle, priority: formPriority, dueDate: formDueDate || undefined },
      {
        onSuccess: () => {
          toast.success('Đã thêm task mới');
          modal.close();
          setFormTitle(''); setFormPriority('MEDIUM'); setFormDueDate('');
        },
        onError: () => toast.error('Lỗi khi thêm task'),
      }
    );
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message="Lỗi khi tải danh sách todo" onRetry={refetch} />;

  const grouped = {
    todo: todos.filter((td) => td.status === 'TODO'),
    inProgress: todos.filter((td) => td.status === 'IN_PROGRESS'),
    done: todos.filter((td) => td.status === 'DONE'),
  };

  return (
    <div className="space-y-5 animate-slide-up">
      <PageHeader
        title={t('todos.title')}
        actions={<Button size="sm" onClick={modal.open}><Plus size={14} />{t('todos.addTodo')}</Button>}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {[
          { key: 'todo', label: 'Cần làm', items: grouped.todo, color: 'border-t-primary/50' },
          { key: 'inProgress', label: 'Đang làm', items: grouped.inProgress, color: 'border-t-yellow-500/50' },
          { key: 'done', label: 'Hoàn thành', items: grouped.done, color: 'border-t-green-500/50' },
        ].map((col) => (
          <div key={col.key} className={`rounded-xl border-t-2 border-border bg-card p-3 space-y-2 ${col.color}`}>
            <div className="flex items-center justify-between px-1 pb-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{col.label}</p>
              <Badge variant="muted">{col.items.length}</Badge>
            </div>
            {col.items.length === 0 && <p className="py-4 text-center text-xs text-muted-foreground">Trống</p>}
            {col.items.map((todo) => {
              const p = priorityConfig[todo.priority] ?? priorityConfig.MEDIUM;
              return (
                <div
                  key={todo.id}
                  className={cn('flex items-start gap-2.5 rounded-lg border-l-2 border-border bg-background p-3 transition-all', p.color)}
                >
                  <button
                    onClick={() => handleToggle(todo.id, todo.status)}
                    className="mt-0.5 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {todo.status === 'DONE'
                      ? <CheckCircle2 size={16} className="text-green-400" />
                      : <Circle size={16} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm text-foreground', todo.status === 'DONE' && 'line-through text-muted-foreground')}>
                      {todo.title}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                      <Badge variant={p.variant}>{p.label}</Badge>
                      {todo.dueDate && (
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock size={10} />{formatDate(todo.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <Modal open={modal.isOpen} onClose={modal.close} title={t('todos.addTodo')}>
        <div className="space-y-4">
          <Input label="Tiêu đề" placeholder="Tên công việc..." value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
          <Select
            label={t('todos.priority')}
            options={[
              { value: 'LOW', label: t('todos.low') },
              { value: 'MEDIUM', label: t('todos.normal') },
              { value: 'HIGH', label: t('todos.high') },
              { value: 'URGENT', label: t('todos.urgent') },
            ]}
            value={formPriority}
            onChange={(e) => setFormPriority(e.target.value as any)}
          />
          <Input label={t('todos.dueDate')} type="date" value={formDueDate} onChange={(e) => setFormDueDate(e.target.value)} />
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" onClick={modal.close} fullWidth>{t('common.cancel')}</Button>
            <Button fullWidth onClick={handleSave} loading={createMutation.isPending}>{t('common.save')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
