import { useTranslation } from 'react-i18next';
import { Circle, CheckCircle2, Clock, Edit2, Trash2 } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { formatDate } from '@/shared/lib/date';
import { cn } from '@/shared/lib/cn';

interface TodoCardProps {
  todo: any;
  priorityConfig: any;
  onToggle: (id: string, status: string) => void;
  onEdit: (todo: any) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, todo: any) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

export function TodoCard({
  todo,
  priorityConfig,
  onToggle,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
}: TodoCardProps) {
  const { t } = useTranslation();
  const p = priorityConfig[todo.priority] ?? priorityConfig.MEDIUM;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, todo)}
      onDragEnd={onDragEnd}
      className={cn(
        'group flex items-start gap-2.5 rounded-lg border-l-2 border-border bg-background p-3 transition-all cursor-grab active:cursor-grabbing hover:border-r hover:border-r-primary/20 hover:shadow-md relative',
        p.color
      )}
    >
      <button
        onClick={() => onToggle(todo.id, todo.status)}
        className="mt-0.5 text-muted-foreground hover:text-primary transition-colors cursor-pointer flex-shrink-0"
      >
        {todo.status === 'DONE' ? (
          <CheckCircle2 size={16} className="text-green-400" />
        ) : (
          <Circle size={16} />
        )}
      </button>

      <div className="flex-1 min-w-0 pr-12">
        <p className={cn('text-sm text-foreground break-words', todo.status === 'DONE' && 'line-through text-muted-foreground')}>
          {todo.title}
        </p>
        <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
          <Badge variant={p.variant}>{t(p.labelKey)}</Badge>
          {todo.dueDate && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock size={10} />
              {formatDate(todo.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="absolute right-2 top-2.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(todo)}
          className="p-1 text-muted-foreground hover:text-primary hover:bg-secondary/40 rounded-md transition-colors cursor-pointer"
          title={t('common.edit')}
        >
          <Edit2 size={12} />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1 text-muted-foreground hover:text-destructive hover:bg-secondary/40 rounded-md transition-colors cursor-pointer"
          title={t('common.delete')}
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
