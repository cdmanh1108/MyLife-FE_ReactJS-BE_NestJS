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

export default function DebtPeoplePage() {
  const { t } = useTranslation();
  const modal = useDisclosure();
  const [formName, setFormName] = useState('');
  const [formNickname, setFormNickname] = useState('');
  const [formNote, setFormNote] = useState('');

  // Queries
  const { data: people = [], isLoading: loadingPeople, isError: isErrorPeople, refetch: refetchPeople } = useDebtPeople();
  const { data: records = [], isLoading: loadingRecords } = useDebtRecords();

  // Mutations
  const createMutation = useCreateDebtPerson();
  const deleteMutation = useDeleteDebtPerson();

  const handleSave = () => {
    if (!formName.trim()) {
      toast.error('Vui lòng nhập tên người nợ/cho nợ');
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
          toast.success('Đã thêm người liên hệ');
          modal.close();
          setFormName('');
          setFormNickname('');
          setFormNote('');
        },
        onError: () => {
          toast.error('Lỗi khi thêm người liên hệ');
        },
      }
    );
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc muốn xóa người liên hệ này? Sẽ không xóa các lịch sử giao dịch liên quan.')) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success('Đã xóa thành công'),
        onError: () => toast.error('Lỗi khi xóa người liên hệ'),
      });
    }
  };

  if (loadingPeople || loadingRecords) return <LoadingState />;
  if (isErrorPeople) return <ErrorState message="Lỗi khi tải danh sách người liên hệ" onRetry={refetchPeople} />;

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
        actions={<Button size="sm" onClick={modal.open}><Plus size={14} />Thêm người</Button>}
      />

      {people.length === 0 ? (
        <EmptyState
          icon={<Users size={24} />}
          title="Chưa có danh sách người liên hệ"
          action={<Button size="sm" onClick={modal.open}>Thêm người đầu tiên</Button>}
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
                    {netBalance > 0 ? 'Họ nợ tôi' : netBalance < 0 ? 'Tôi nợ họ' : 'Đã sòng phẳng'}
                  </p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <p className={`font-mono text-sm font-semibold ${netBalance > 0 ? 'text-green-400' : netBalance < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
                    {netBalance !== 0 ? formatCompactMoney(Math.abs(netBalance), 'VND') : '—'}
                  </p>
                  <button
                    onClick={(e) => handleDelete(person.id, e)}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-secondary/40 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Xóa liên hệ"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modal.isOpen} onClose={modal.close} title="Thêm người liên hệ">
        <div className="space-y-4">
          <Input
            label="Họ tên"
            placeholder="Ví dụ: Nguyễn Văn A..."
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />

          <Input
            label="Biệt danh (Không bắt buộc)"
            placeholder="Ví dụ: Bạn thân, Đồng nghiệp..."
            value={formNickname}
            onChange={(e) => setFormNickname(e.target.value)}
          />

          <Input
            label="Ghi chú"
            placeholder="Thông tin liên hệ, ghi chú..."
            value={formNote}
            onChange={(e) => setFormNote(e.target.value)}
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
