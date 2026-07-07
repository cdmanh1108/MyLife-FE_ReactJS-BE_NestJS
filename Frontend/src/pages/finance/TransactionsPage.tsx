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
import { useTransactions, useDeleteTransaction, useUpdateTransaction } from '@/features/finance/api/useTransactions';
import { useCreateTransaction } from '@/features/finance/api/useCreateTransaction';
import { useCategories, useCreateCategory } from '@/features/finance/api/useCategories';
import { toast } from 'sonner';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';

export default function TransactionsPage() {
  const { t } = useTranslation();
  const modal = useDisclosure();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'INCOME' | 'EXPENSE'>('all');

  // Form State
  const [editingTx, setEditingTx] = useState<any>(null);
  const [formType, setFormType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [formAmount, setFormAmount] = useState('');
  const [formCategoryName, setFormCategoryName] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formNote, setFormNote] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Queries & Mutations
  const { data: categories = [], isLoading: loadingCats } = useCategories();
  const { data: transactions = [], isLoading, isError, refetch } = useTransactions({
    limit: 100, // Fetch up to 100 transactions for client-side pagination & filtering
  });

  const createTxMutation = useCreateTransaction();
  const updateTxMutation = useUpdateTransaction();
  const createCatMutation = useCreateCategory();
  const deleteTxMutation = useDeleteTransaction();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (value: 'all' | 'INCOME' | 'EXPENSE') => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleEdit = (tx: any) => {
    setEditingTx(tx);
    setFormType(tx.type);
    setFormAmount(tx.amount.toString());
    setFormCategoryId(tx.categoryId || '');
    setFormCategoryName('');
    setFormNote(tx.note || '');
    setFormDate(tx.occurredAt.split('T')[0]);
    modal.open();
  };

  const handleCloseModal = () => {
    modal.close();
    setEditingTx(null);
    setFormAmount('');
    setFormCategoryId('');
    setFormCategoryName('');
    setFormNote('');
    setFormDate(new Date().toISOString().split('T')[0]);
  };

  const handleSave = async () => {
    if (!formAmount || isNaN(Number(formAmount))) {
      toast.error(t('finance.toastInvalidAmount'));
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
        toast.error(t('finance.toastCreateCategoryError'));
        return;
      }
    }

    const payload = {
      type: formType,
      amount: Number(formAmount),
      currency: 'VND',
      categoryId: finalCategoryId || undefined,
      note: formNote || undefined,
      occurredAt: new Date(formDate).toISOString(),
    };

    if (editingTx) {
      updateTxMutation.mutate(
        { id: editingTx.id, dto: payload },
        {
          onSuccess: () => {
            toast.success(t('finance.toastUpdateSuccess'));
            handleCloseModal();
          },
          onError: () => {
            toast.error(t('finance.toastUpdateError'));
          },
        }
      );
    } else {
      createTxMutation.mutate(
        payload,
        {
          onSuccess: () => {
            toast.success(t('finance.toastCreateSuccess'));
            handleCloseModal();
          },
          onError: () => {
            toast.error(t('finance.toastCreateError'));
          },
        }
      );
    }
  };

  const catMap = new Map(categories.map((c) => [c.id, c]));

  // Client-side filtering
  const filteredTransactions = transactions.filter((tx) => {
    // 1. Filter by type
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false;

    // 2. Filter by search keyword
    if (search.trim()) {
      const keyword = search.toLowerCase();
      const noteMatch = tx.note?.toLowerCase().includes(keyword);
      const category = tx.categoryId ? catMap.get(tx.categoryId) : null;
      const categoryMatch = category?.name.toLowerCase().includes(keyword);
      if (!noteMatch && !categoryMatch) return false;
    }
    return true;
  });

  // Calculate pagination slice
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading || loadingCats) return <LoadingState />;
  if (isError) return <ErrorState message={t('common.error')} onRetry={refetch} />;

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
            onChange={(e) => handleSearchChange(e.target.value)}
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
          onChange={(e) => handleTypeFilterChange(e.target.value as any)}
          className="w-full sm:w-36"
        />
      </div>

      {totalItems === 0 ? (
        <EmptyState
          icon={<ArrowUpRight size={24} />}
          title={t('finance.noTransactions')}
          action={<Button size="sm" onClick={modal.open}><Plus size={14} />{t('finance.addTransaction')}</Button>}
        />
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            {paginatedTransactions.map((tx) => {
              const category = tx.categoryId ? catMap.get(tx.categoryId) : null;
              return (
                <Card key={tx.id} className="flex items-center gap-4 p-3 card-glow group relative bg-card">
                  <div className={cn('flex size-9 flex-shrink-0 items-center justify-center rounded-lg',
                    tx.type === 'INCOME' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400')}>
                    {tx.type === 'INCOME' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{category?.name || t('finance.defaultTransactionName')}</p>
                      <Badge variant="muted">{t('finance.mainWallet')}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{tx.note || '—'} · {formatDate(tx.occurredAt)}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <p className={cn('font-mono font-semibold text-sm flex-shrink-0',
                      tx.type === 'INCOME' ? 'text-green-400' : 'text-red-400')}>
                      {tx.type === 'INCOME' ? '+' : '-'}{formatMoney(tx.amount, tx.currency)}
                    </p>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(tx)}
                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-secondary/40 rounded-md"
                        title={t('finance.editTransaction')}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-secondary/40 rounded-md"
                        title={t('finance.deleteTransaction')}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-border/20">
              <p className="text-xs text-muted-foreground">
                {t('finance.showingTransactions', {
                  start: (currentPage - 1) * itemsPerPage + 1,
                  end: Math.min(currentPage * itemsPerPage, totalItems),
                  total: totalItems
                })}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  {t('finance.prevPage')}
                </Button>
                <span className="text-xs font-mono font-medium text-foreground px-2">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  {t('finance.nextPage')}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <Modal open={modal.isOpen} onClose={handleCloseModal} title={editingTx ? t('finance.editTransaction') : t('finance.addTransaction')} size="md">
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
            <label className="text-xs font-medium text-muted-foreground">{t('finance.category')}</label>
            <div className="flex gap-2">
              <Select
                options={[
                  { value: '', label: t('finance.selectCategoryPlaceholder') },
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
              <span className="text-sm text-muted-foreground self-center">{t('finance.or')}</span>
              <Input
                placeholder={t('finance.createCategoryPlaceholder')}
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
            placeholder={`${t('finance.note')}...`}
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
            <Button variant="ghost" onClick={handleCloseModal} fullWidth>{t('common.cancel')}</Button>
            <Button fullWidth onClick={handleSave} loading={createTxMutation.isPending || updateTxMutation.isPending || createCatMutation.isPending}>
              {t('common.save')}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteTxMutation.mutate(deleteId, {
              onSuccess: () => {
                toast.success(t('finance.toastDeleteSuccess'));
                setDeleteId(null);
              },
              onError: () => toast.error(t('finance.toastDeleteError')),
            });
          }
        }}
        title={t('finance.deleteTransaction')}
        description={t('finance.deleteConfirm')}
        variant="danger"
        confirmText={t('common.delete')}
        loading={deleteTxMutation.isPending}
      />
    </div>
  );
}

