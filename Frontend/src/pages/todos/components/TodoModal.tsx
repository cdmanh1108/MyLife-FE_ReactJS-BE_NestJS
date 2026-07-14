import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';

interface TodoModalProps {
  open: boolean;
  onClose: () => void;
  todo: any | null;
  onSave: (data: { title: string; priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'; dueDate?: string }) => void;
  loading: boolean;
}

export function TodoModal({ open, onClose, todo, onSave, loading }: TodoModalProps) {
  const { t } = useTranslation();
  const [formTitle, setFormTitle] = useState('');
  const [formPriority, setFormPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [formDueDate, setFormDueDate] = useState('');

  useEffect(() => {
    if (todo) {
      setFormTitle(todo.title);
      setFormPriority(todo.priority);
      setFormDueDate(todo.dueDate ? todo.dueDate.split('T')[0] : '');
    } else {
      setFormTitle('');
      setFormPriority('MEDIUM');
      setFormDueDate('');
    }
  }, [todo, open]);

  const handleSave = () => {
    onSave({
      title: formTitle,
      priority: formPriority,
      dueDate: formDueDate || undefined,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={todo ? t('todos.editTodo') : t('todos.addTodo')}>
      <div className="space-y-4">
        <Input
          label={t('todos.taskTitle')}
          placeholder={t('todos.taskTitlePlaceholder')}
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
        />
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
        <Input
          label={t('todos.dueDate')}
          type="date"
          value={formDueDate}
          onChange={(e) => setFormDueDate(e.target.value)}
        />
        <div className="flex gap-2 pt-2">
          <Button variant="ghost" onClick={onClose} fullWidth>
            {t('common.cancel')}
          </Button>
          <Button fullWidth onClick={handleSave} loading={loading}>
            {t('common.save')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
