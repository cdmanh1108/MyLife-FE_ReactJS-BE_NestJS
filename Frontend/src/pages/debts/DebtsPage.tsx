import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, ArrowUpLeft, ArrowDownRight, CheckCircle, Circle } from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Card } from '@/shared/ui/Card';
import { StatCard } from '@/shared/ui/StatCard';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { EmptyState } from '@/shared/ui/EmptyState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { formatMoney, formatCompactMoney } from '@/shared/lib/money';
import { formatDate } from '@/shared/lib/date';
import { cn } from '@/shared/lib/cn';
import { useDebtRecords, useCreateDebtRecord, useSettleDebtRecord } from '@/features/debts/api/useDebtRecords';
import { useDebtSummary } from '@/features/debts/api/useDebtSummary';
import { useDebtPeople, useCreateDebtPerson } from '@/features/debts/api/useDebtPeople';
import { toast } from 'sonner';

export default function DebtsPage() {
  const { t } = useTranslation();
  const modal = useDisclosure();

  // Form state
  const [formPersonId, setFormPersonId] = useState('');
  const [formNewPerson, setFormNewPerson] = useState('');
  const [formDirection, setFormDirection] = useState<'I_OWE' | 'OWES_ME'>('OWES_ME');
  const [formAmount, setFormAmount] = useState('');
  const [formNote, setFormNote] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: records = [], isLoading, isError, refetch } = useDebtRecords();
  const { data: summary } = useDebtSummary();
  const { data: people = [] } = useDebtPeople();
  const createRecord = useCreateDebtRecord();
  const createPerson = useCreateDebtPerson();
  const settleRecord = useSettleDebtRecord();

  const handleSave = async () => {
    if (!formAmount || isNaN(Number(formAmount))) { toast.error('Số tiền không hợp lệ'); return; }

    let personId = formPersonId;
    if (!personId && formNewPerson.trim()) {
      try {
        const p = await createPerson.mutateAsync({ name: formNewPerson.trim() });
        personId = p.id;
      } catch {
        toast.error('Không thể tạo người nợ mới'); return;
      }
    }
    if (!personId) { toast.error('Vui lòng chọn hoặc nhập tên người'); return; }

    createRecord.mutate(
      { personId, direction: formDirection, amount: Number(formAmount), currency: 'VND', note: formNote || undefined, occurredAt: new Date(formDate).toISOString() },
      {
        onSuccess: () => {
          toast.success('Đã thêm khoản nợ');
          modal.close();
          setFormPersonId(''); setFormNewPerson(''); setFormAmount(''); setFormNote('');
          setFormDate(new Date().toISOString().split('T')[0]);
        },
        onError: () => toast.error('Lỗi khi thêm khoản nợ'),
      }
    );
  };

  const handleSettle = (id: string) => {
    settleRecord.mutate(id, {
      onSuccess: () => toast.success('Đã đánh dấu đã trả'),
      onError: () => toast.error('Lỗi khi cập nhật'),
    });
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message="Lỗi khi tải dữ liệu nợ" onRetry={refetch} />;

  const totalIOwe = summary?.totalIOwe ?? 0;
  const totalOwedToMe = summary?.totalOwedToMe ?? 0;

  return (
    <div className="space-y-5 animate-slide-up">
      <PageHeader
        title={t('debts.title')}
        actions={<Button size="sm" onClick={modal.open}><Plus size={14} />{t('debts.addDebt')}</Button>}
      />

      <div className="grid grid-cols-2 gap-4">
        <StatCard label={t('dashboard.iOwe')} value={formatCompactMoney(totalIOwe)} subValue={formatMoney(totalIOwe)} variant="expense" />
        <StatCard label={t('dashboard.owedToMe')} value={formatCompactMoney(totalOwedToMe)} subValue={formatMoney(totalOwedToMe)} variant="income" />
      </div>

      {records.length === 0 ? (
        <EmptyState
          icon={<ArrowDownRight size={24} />}
          title={t('debts.noDebts') || 'Chưa có khoản nợ nào'}
          action={<Button size="sm" onClick={modal.open}><Plus size={14} />Thêm khoản nợ đầu tiên</Button>}
        />
      ) : (
        <div className="space-y-2">
          {(() => {
            const personMap = new Map(people.map((p) => [p.id, p.name]));
            return records.map((debt) => {
              const personName = personMap.get(debt.personId) || 'Không xác định';
              return (
                <Card key={debt.id} className={cn('flex items-center gap-4 p-3 card-glow group relative bg-card', debt.status === 'SETTLED' && 'opacity-60')}>
                  <div className={cn('flex size-9 flex-shrink-0 items-center justify-center rounded-lg',
                    debt.direction === 'OWES_ME' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400')}>
                    {debt.direction === 'OWES_ME' ? <ArrowDownRight size={16} /> : <ArrowUpLeft size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{personName}</p>
                      <Badge variant={debt.status === 'OPEN' ? 'warning' : 'muted'}>
                        {debt.status === 'OPEN' ? t('debts.open') : t('debts.settled')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {debt.direction === 'OWES_ME' ? 'Họ nợ tôi' : 'Tôi nợ họ'} · {debt.note || '—'} · {formatDate(debt.occurredAt)}
                    </p>
                  </div>
                  <p className={cn('font-mono font-semibold text-sm flex-shrink-0',
                    debt.direction === 'OWES_ME' ? 'text-green-400' : 'text-red-400')}>
                    {formatMoney(debt.amount, debt.currency)}
                  </p>
                  {debt.status === 'OPEN' && (
                    <button
                      onClick={() => handleSettle(debt.id)}
                      className="p-1.5 text-muted-foreground hover:text-green-400 transition-colors"
                      title="Đánh dấu đã trả"
                    >
                      <Circle size={14} />
                    </button>
                  )}
                  {debt.status === 'SETTLED' && <CheckCircle size={14} className="text-green-400/50" />}
                </Card>
              );
            });
          })()}
        </div>
      )}

      <Modal open={modal.isOpen} onClose={modal.close} title={t('debts.addDebt')}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">{t('debts.person')}</label>
            <div className="flex gap-2">
              <Select
                options={[
                  { value: '', label: '-- Chọn người --' },
                  ...people.map((p) => ({ value: p.id, label: p.name })),
                ]}
                value={formPersonId}
                onChange={(e) => { setFormPersonId(e.target.value); if (e.target.value) setFormNewPerson(''); }}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground self-center">hoặc</span>
              <Input
                placeholder="Tên mới..."
                value={formNewPerson}
                onChange={(e) => { setFormNewPerson(e.target.value); if (e.target.value) setFormPersonId(''); }}
                className="w-36"
              />
            </div>
          </div>
          <Select
            label={t('debts.direction')}
            options={[{ value: 'I_OWE', label: t('debts.iOwe') }, { value: 'OWES_ME', label: t('debts.owesMe') }]}
            value={formDirection}
            onChange={(e) => setFormDirection(e.target.value as any)}
          />
          <Input label={t('debts.amount')} type="number" placeholder="0" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} />
          <Input label="Ghi chú" placeholder="Nội dung khoản nợ..." value={formNote} onChange={(e) => setFormNote(e.target.value)} />
          <Input label="Ngày" type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" onClick={modal.close} fullWidth>{t('common.cancel')}</Button>
            <Button fullWidth onClick={handleSave} loading={createRecord.isPending || createPerson.isPending}>{t('common.save')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
