import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Users } from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Avatar } from '@/shared/ui/Avatar';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { EmptyState } from '@/shared/ui/EmptyState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { formatCompactMoney } from '@/shared/lib/money';
import { useDebtPeople, useCreateDebtPerson, useDeleteDebtPerson } from '@/features/debts/api/useDebtPeople';
import { useDebtRecords } from '@/features/debts/api/useDebtRecords';
import { toast } from 'sonner';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';

export default function DebtPeoplePage() {
  const { t } = useTranslation();
  const modal = useDisclosure();
  const [formName, setFormName] = useState('');
  const [formNickname, setFormNickname] = useState('');
  const [formNote, setFormNote] = useState('');

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Queries
  const { data: people = [], isLoading: loadingPeople, isError: isErrorPeople, refetch: refetchPeople } = useDebtPeople();
  const { data: records = [], isLoading: loadingRecords } = useDebtRecords();

  // Mutations
  const createMutation = useCreateDebtPerson();
  const deleteMutation = useDeleteDebtPerson();

  const handleSave = () => {
    if (!formName.trim()) {
      toast.error(t('debts.toastEnterName'));
      return;
    }
    createMutation.mutate(
      {
        name: formName.trim(),
        nickname: formNickname.trim() || undefined,
        note: formNote.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success(t('debts.toastCreateSuccess'));
          modal.close();
          setFormName('');
          setFormNickname('');
          setFormNote('');
        },
        onError: () => {
          toast.error(t('debts.toastCreateError'));
        },
      }
    );
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  if (loadingPeople || loadingRecords) return <LoadingState />;
  if (isErrorPeople) return <ErrorState message={t('debts.errorLoad')} onRetry={refetchPeople} />;

  // Calculate net balance for a person
  const getNetBalance = (personId: string) => {
    return records
      .filter((r) => r.personId === personId && r.status === 'OPEN')
      .reduce((sum, r) => {
        if (r.direction === 'OWES_ME') {
          return sum + r.amount;
        } else if (r.direction === 'I_OWE') {
          return sum - r.amount;
        }
        return sum;
      }, 0);
  };

  return (
    <div className="space-y-5 animate-slide-up">
      <PageHeader
        title={t('nav.people')}
        actions={<Button size="sm" onClick={modal.open}><Plus size={14} />{t('debts.addPerson')}</Button>}
      />

      {people.length === 0 ? (
        <EmptyState
          icon={<Users size={24} />}
          title={t('debts.noPeopleTitle')}
          action={<Button size="sm" onClick={modal.open}>{t('debts.addFirstPerson')}</Button>}
        />
      ) : (
        <div className="space-y-2">
          {people.map((person) => {
            const netBalance = getNetBalance(person.id);
            return (
              <Card key={person.id} className="flex items-center gap-3 p-3 card-glow group relative bg-card">
                <Avatar name={person.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-foreground truncate">{person.name}</p>
                    {person.nickname && (
                      <span className="text-[10px] text-muted-foreground italic">({person.nickname})</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {netBalance > 0 ? t('debts.owesMeLabel') : netBalance < 0 ? t('debts.iOweLabel') : t('debts.settledLabel')}
                  </p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <p className={`font-mono text-sm font-semibold ${netBalance > 0 ? 'text-green-400' : netBalance < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
                    {netBalance !== 0 ? formatCompactMoney(Math.abs(netBalance), 'VND') : '—'}
                  </p>
                  <button
                    onClick={(e) => handleDelete(person.id, e)}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-secondary/40 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title={t('debts.deleteContact')}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modal.isOpen} onClose={modal.close} title={t('debts.addContactTitle')}>
        <div className="space-y-4">
          <Input
            label={t('debts.fullName')}
            placeholder={t('debts.fullNamePlaceholder')}
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />

          <Input
            label={t('debts.nickname')}
            placeholder={t('debts.nicknamePlaceholder')}
            value={formNickname}
            onChange={(e) => setFormNickname(e.target.value)}
          />

          <Input
            label={t('debts.note')}
            placeholder={t('debts.notePlaceholder')}
            value={formNote}
            onChange={(e) => setFormNote(e.target.value)}
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
                toast.success(t('debts.toastDeleteSuccess'));
                setDeleteId(null);
              },
              onError: () => toast.error(t('debts.toastDeleteError')),
            });
          }
        }}
        title={t('debts.deleteContact')}
        description={t('confirmations.deletePerson')}
        variant="danger"
        confirmText={t('common.delete')}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
