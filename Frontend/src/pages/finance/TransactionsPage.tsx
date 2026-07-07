import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, ArrowUpRight, ArrowDownRight, Trash2, Edit2 } from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Badge } from '@/shared/ui/Badge';
import { Card } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Modal } from '@/shared/ui/Modal';
import { Select } from '@/shared/ui/Select';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { formatMoney } from '@/shared/lib/money';
import { formatDate } from '@/shared/lib/date';
import { cn } from '@/shared/lib/cn';
import { LoadingState } from '@/shared/ui/LoadingState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { useTransactions, useDeleteTransaction } from '@/features/finance/api/useTransactions';
import { useCreateTransaction } from '@/features/finance/api/useCreateTransaction';
import { useCategories, useCreateCategory } from '@/features/finance/api/useCategories';
import { toast } from 'sonner';

export default function TransactionsPage() {
  const { t } = useTranslation();
  const modal = useDisclosure();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'INCOME' | 'EXPENSE'>('all');

  // Form State
  const [formType, setFormType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [formAmount, setFormAmount] = useState('');
  const [formCategoryName, setFormCategoryName] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formNote, setFormNote] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);

  // Queries & Mutations
  const { data: categories = [], isLoading: loadingCats } = useCategories();
  const { data: transactions = [], isLoading, isError, refetch } = useTransactions({
    type: typeFilter === 'all' ? undefined : typeFilter,
    keyword: search || undefined,
  });

  const createTxMutation = useCreateTransaction();
  const createCatMutation = useCreateCategory();
  const deleteTxMutation = useDeleteTransaction();

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) {
      deleteTxMutation.mutate(id, {
        onSuccess: () => toast.success('Đã xóa giao dịch thành công'),
        onError: () => toast.error('Lỗi khi xóa giao dịch'),
      });
    }
  };

  const handleSave = async () => {
    if (!formAmount || isNaN(Number(formAmount))) {
      toast.error('Số tiền không hợp lệ');
      return;
    }

    let finalCategoryId = formCategoryId;

    // If new category name is entered but not selected from dropdown
    if (!finalCategoryId && formCategoryName.trim()) {
      try {
        const newCat = await createCatMutation.mutateAsync({
          name: formCategoryName.trim(),
          type: formType,
        });
        finalCategoryId = newCat.id;
      } catch (err) {
        toast.error('Không thể tạo danh mục mới');
        return;
      }
    }

    createTxMutation.mutate(
      {
        type: formType,
        amount: Number(formAmount),
        currency: 'VND',
        categoryId: finalCategoryId || undefined,
        note: formNote || undefined,
        occurredAt: new Date(formDate).toISOString(),
      },
      {
        onSuccess: () => {
          toast.success('Thêm giao dịch thành công');
          modal.close();
          // Reset form
          setFormAmount('');
          setFormCategoryId('');
          setFormCategoryName('');
          setFormNote('');
          setFormDate(new Date().toISOString().split('T')[0]);
        },
        onError: () => {
          toast.error('Lỗi khi thêm giao dịch');
        },
      }
    );
  };

  const catMap = new Map(categories.map((c) => [c.id, c]));

  if (isLoading || loadingCats) return <LoadingState />;
  if (isError) return <ErrorState message="Lỗi khi tải danh sách giao dịch" onRetry={refetch} />;

  return (
    <div className="space-y-5 animate-slide-up">
      <PageHeader
        title={t('nav.transactions')}
        actions={<Button size="sm" onClick={modal.open}><Plus size={14} />{t('finance.addTransaction')}</Button>}
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('common.search')}
            className="h-9 w-full rounded-md border border-border bg-input-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Select
          options={[
            { value: 'all', label: t('common.all') },
            { value: 'INCOME', label: t('finance.income') },
            { value: 'EXPENSE', label: t('finance.expense') },
          ]}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="w-full sm:w-36"
        />
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          icon={<ArrowUpRight size={24} />}
          title={t('finance.noTransactions')}
          action={<Button size="sm" onClick={modal.open}><Plus size={14} />Thêm giao dịch đầu tiên</Button>}
        />
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => {
            const category = tx.categoryId ? catMap.get(tx.categoryId) : null;
            return (
              <Card key={tx.id} className="flex items-center gap-4 p-3 card-glow group relative bg-card">
                <div className={cn('flex size-9 flex-shrink-0 items-center justify-center rounded-lg',
                  tx.type === 'INCOME' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400')}>
                  {tx.type === 'INCOME' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{category?.name || 'Giao dịch'}</p>
                    <Badge variant="muted">Ví chính</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{tx.note || '—'} · {formatDate(tx.occurredAt)}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <p className={cn('font-mono font-semibold text-sm flex-shrink-0',
                    tx.type === 'INCOME' ? 'text-green-400' : 'text-red-400')}>
                    {tx.type === 'INCOME' ? '+' : '-'}{formatMoney(tx.amount, tx.currency)}
                  </p>
                  <button
                    onClick={() => handleDelete(tx.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-secondary/40 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Xóa giao dịch"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modal.isOpen} onClose={modal.close} title={t('finance.addTransaction')} size="md">
        <div className="space-y-4">
          <Select
            label={t('finance.type')}
            options={[{ value: 'INCOME', label: t('finance.income') }, { value: 'EXPENSE', label: t('finance.expense') }]}
            value={formType}
            onChange={(e) => setFormType(e.target.value as any)}
          />
          <Input
            label={t('finance.amount')}
            type="number"
            placeholder="0"
            value={formAmount}
            onChange={(e) => setFormAmount(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Danh mục</label>
            <div className="flex gap-2">
              <Select
                options={[
                  { value: '', label: '-- Chọn danh mục --' },
                  ...categories
                    .filter((c) => c.type === formType)
                    .map((c) => ({ value: c.id, label: c.name })),
                ]}
                value={formCategoryId}
                onChange={(e) => {
                  setFormCategoryId(e.target.value);
                  if (e.target.value) setFormCategoryName('');
                }}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground self-center">hoặc</span>
              <Input
                placeholder="Tạo danh mục mới..."
                value={formCategoryName}
                onChange={(e) => {
                  setFormCategoryName(e.target.value);
                  if (e.target.value) setFormCategoryId('');
                }}
                className="w-44"
              />
            </div>
          </div>

          <Input
            label={t('finance.note')}
            placeholder="Ghi chú..."
            value={formNote}
            onChange={(e) => setFormNote(e.target.value)}
          />
          <Input
            label={t('finance.date')}
            type="date"
            value={formDate}
            onChange={(e) => setFormDate(e.target.value)}
          />
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" onClick={modal.close} fullWidth>{t('common.cancel')}</Button>
            <Button fullWidth onClick={handleSave} loading={createTxMutation.isPending || createCatMutation.isPending}>
              {t('common.save')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

