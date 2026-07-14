import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/shared/ui/Badge';
import { TodoCard } from './TodoCard';
import { cn } from '@/shared/lib/cn';

interface TodoColumnProps {
  status: string;
  label: string;
  items: any[];
  color: string;
  priorityConfig: any;
  onToggle: (id: string, status: string) => void;
  onEdit: (todo: any) => void;
  onDelete: (id: string) => void;
  onDrop: (draggedTodo: any, status: string, index: number) => void;
}

export function TodoColumn({
  status,
  label,
  items,
  color,
  priorityConfig,
  onToggle,
  onEdit,
  onDelete,
  onDrop,
}: TodoColumnProps) {
  const { t } = useTranslation();
  const [isColumnOver, setIsColumnOver] = useState(false);

  // Drag states to pass down
  const handleDragStart = (e: React.DragEvent, todo: any) => {
    e.dataTransfer.setData('text/plain', todo.id);
    e.dataTransfer.setData('todo', JSON.stringify(todo));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.dataTransfer.clearData();
  };

  return (
    <div className={cn('rounded-xl border-t-2 border-border bg-card p-3 space-y-2 flex flex-col', color)}>
      <div className="flex items-center justify-between px-1 pb-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
        <Badge variant="muted">{items.length}</Badge>
      </div>

      <div className="flex-1 flex flex-col min-h-[300px]">
        {items.length === 0 ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsColumnOver(true);
            }}
            onDragLeave={() => setIsColumnOver(false)}
            onDrop={(e) => {
              setIsColumnOver(false);
              const dataStr = e.dataTransfer.getData('todo');
              if (dataStr) {
                onDrop(JSON.parse(dataStr), status, 0);
              }
            }}
            className={cn(
              'flex-1 flex items-center justify-center py-12 text-center text-xs text-muted-foreground border-2 border-dashed border-transparent rounded-lg transition-all',
              isColumnOver ? 'border-primary/40 bg-primary/5 text-primary' : 'bg-transparent'
            )}
          >
            {t('common.empty')}
          </div>
        ) : (
          <div className="space-y-1 flex-1">
            {/* Top Drop Zone */}
            <DropZone index={0} status={status} onDrop={onDrop} />
            
            {items.map((todo, idx) => (
              <div key={todo.id} className="space-y-1">
                <TodoCard
                  todo={todo}
                  priorityConfig={priorityConfig}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                />
                {/* Drop Zone between cards */}
                <DropZone index={idx + 1} status={status} onDrop={onDrop} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface DropZoneProps {
  index: number;
  status: string;
  onDrop: (draggedTodo: any, status: string, index: number) => void;
}

function DropZone({ index, status, onDrop }: DropZoneProps) {
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        setIsOver(false);
        const dataStr = e.dataTransfer.getData('todo');
        if (dataStr) {
          onDrop(JSON.parse(dataStr), status, index);
        }
      }}
      className={cn(
        'h-1 transition-all duration-200 my-0.5 rounded',
        isOver ? 'h-7 bg-primary/20 border border-dashed border-primary/40' : 'h-1 bg-transparent'
      )}
    />
  );
}
