import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button } from '@/shared/ui/Button';
import { LoadingState } from '@/shared/ui/LoadingState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import {
  useTodos,
  useCreateTodo,
  useUpdateTodo,
  useDeleteTodo,
  useCompleteTodo,
  useReopenTodo,
} from '@/features/todos/api/useTodos';
import { toast } from 'sonner';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { TodoColumn } from './components/TodoColumn';
import { TodoModal } from './components/TodoModal';

// Priority Configuration mapping
const priorityConfig: Record<
  string,
  { labelKey: string; variant: 'danger' | 'warning' | 'info' | 'muted'; color: string }
> = {
  URGENT: { labelKey: 'todos.urgent', variant: 'danger', color: 'border-l-red-500' },
  HIGH: { labelKey: 'todos.high', variant: 'warning', color: 'border-l-yellow-500' },
  MEDIUM: { labelKey: 'todos.normal', variant: 'info', color: 'border-l-primary' },
  LOW: { labelKey: 'todos.low', variant: 'muted', color: 'border-l-border' },
};

export default function TodosPage() {
  const { t } = useTranslation();
  const modal = useDisclosure();
  const confirmDelete = useDisclosure();
  const [activeTodo, setActiveTodo] = useState<any | null>(null);

  // Queries & Mutations
  const { data: todos = [], isLoading, isError, refetch } = useTodos();
  const createMutation = useCreateTodo();
  const updateMutation = useUpdateTodo();
  const deleteMutation = useDeleteTodo();
  const completeMutation = useCompleteTodo();
  const reopenMutation = useReopenTodo();

  const handleToggle = (id: string, status: string) => {
    if (status === 'DONE') {
      reopenMutation.mutate(id, { onError: () => toast.error(t('todos.toastReopenError')) });
    } else {
      completeMutation.mutate(id, { onError: () => toast.error(t('todos.toastCompleteError')) });
    }
  };

  const handleEditClick = (todo: any) => {
    setActiveTodo(todo);
    modal.open();
  };

  const handleDeleteClick = (id: string) => {
    setActiveTodo({ id });
    confirmDelete.open();
  };

  const handleSave = (data: { title: string; priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'; dueDate?: string }) => {
    if (!data.title.trim()) {
      toast.error(t('todos.toastEnterTitle'));
      return;
    }

    if (activeTodo && activeTodo.id) {
      updateMutation.mutate(
        {
          id: activeTodo.id,
          dto: data,
        },
        {
          onSuccess: () => {
            toast.success(t('todos.toastUpdateSuccess'));
            modal.close();
            setActiveTodo(null);
          },
          onError: () => toast.error(t('todos.toastUpdateError')),
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success(t('todos.toastCreateSuccess'));
          modal.close();
        },
        onError: () => toast.error(t('todos.toastCreateError')),
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!activeTodo || !activeTodo.id) return;

    deleteMutation.mutate(activeTodo.id, {
      onSuccess: () => {
        toast.success(t('todos.toastDeleteSuccess'));
        confirmDelete.close();
        setActiveTodo(null);
      },
      onError: () => toast.error(t('todos.toastDeleteError')),
    });
  };

  const handleDrop = (draggedTodo: any, targetStatus: string, targetIndex: number) => {
    // 1. Get other items currently in the target column (excluding the dragged item itself)
    const columnItems = todos
      .filter((t: any) => t.status === targetStatus && t.id !== draggedTodo.id)
      .sort((a: any, b: any) => a.order - b.order);

    let newOrder = 1000;
    if (columnItems.length === 0) {
      newOrder = 1000;
    } else if (targetIndex === 0) {
      // Top of column
      newOrder = columnItems[0].order - 1000;
    } else if (targetIndex >= columnItems.length) {
      // Bottom of column
      newOrder = columnItems[columnItems.length - 1].order + 1000;
    } else {
      // Between two items
      const before = columnItems[targetIndex - 1];
      const after = columnItems[targetIndex];
      newOrder = (before.order + after.order) / 2;
    }

    updateMutation.mutate(
      {
        id: draggedTodo.id,
        dto: {
          status: targetStatus,
          order: newOrder,
        },
      },
      {
        onError: () => toast.error(t('todos.toastUpdateError')),
      }
    );
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={t('todos.errorLoad')} onRetry={refetch} />;

  // Ensure sorting matches order
  const sortedTodos = [...todos].sort((a: any, b: any) => a.order - b.order);

  const columns = [
    {
      status: 'TODO',
      label: t('todos.todo'),
      items: sortedTodos.filter((td: any) => td.status === 'TODO'),
      color: 'border-t-primary/50',
    },
    {
      status: 'IN_PROGRESS',
      label: t('todos.inProgress'),
      items: sortedTodos.filter((td: any) => td.status === 'IN_PROGRESS'),
      color: 'border-t-yellow-500/50',
    },
    {
      status: 'DONE',
      label: t('todos.completed'),
      items: sortedTodos.filter((td: any) => td.status === 'DONE'),
      color: 'border-t-green-500/50',
    },
  ];

  return (
    <div className="space-y-5 animate-slide-up">
      <PageHeader
        title={t('todos.title')}
        actions={
          <Button
            size="sm"
            onClick={() => {
              setActiveTodo(null);
              modal.open();
            }}
          >
            <Plus size={14} />
            {t('todos.addTodo')}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {columns.map((col) => (
          <TodoColumn
            key={col.status}
            status={col.status}
            label={col.label}
            items={col.items}
            color={col.color}
            priorityConfig={priorityConfig}
            onToggle={handleToggle}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onDrop={handleDrop}
          />
        ))}
      </div>

      {/* Add / Edit Todo Modal */}
      <TodoModal
        open={modal.isOpen}
        onClose={modal.close}
        todo={activeTodo}
        onSave={handleSave}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={confirmDelete.isOpen}
        onClose={confirmDelete.close}
        onConfirm={handleDeleteConfirm}
        title={t('todos.confirmDeleteTitle')}
        description={t('todos.confirmDeleteMessage')}
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
