import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Card, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { EmptyState } from '@/shared/ui/EmptyState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { formatMoney } from '@/shared/lib/money';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { useBudgets, useCreateBudget, useDeleteBudget } from '@/features/finance/api/useBudgets';
import { useTransactions } from '@/features/finance/api/useTransactions';
import { useCategories } from '@/features/finance/api/useCategories';
import { toast } from 'sonner';

export default function BudgetsPage() {
  const { t } = useTranslation();
  const modal = useDisclosure();

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formMonth, setFormMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  // Queries
  const { data: budgets = [], isLoading: loadingBudgets, isError: isErrorBudgets, refetch: refetchBudgets } = useBudgets();
  const { data: transactions = [], isLoading: loadingTxs } = useTransactions({ limit: 100 });
  const { data: categories = [], isLoading: loadingCats } = useCategories();

  // Mutations
  const createMutation = useCreateBudget();
  const deleteMutation = useDeleteBudget();

  const handleSave = () => {
    if (!formName.trim()) {
      toast.error('Vui lòng nhập tên ngân sách');
      return;
    }
    if (!formAmount || isNaN(Number(formAmount)) || Number(formAmount) <= 0) {
      toast.error('Vui lòng nhập hạn mức hợp lệ');
      return;
    }
    if (!formMonth) {
      toast.error('Vui lòng chọn tháng áp dụng');
      return;
    }

    const payload = {
      name: formName.trim(),
      categoryId: formCategoryId || undefined,
      amount: Number(formAmount),
      currency: 'VND' as const,
      month: formMonth,
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Đã tạo ngân sách thành công');
        modal.close();
        setFormName('');
        setFormCategoryId('');
        setFormAmount('');
        setFormMonth(new Date().toISOString().slice(0, 7));
      },
      onError: () => {
        toast.error('Lỗi khi tạo ngân sách');
      },
    });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc muốn xóa ngân sách này?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success('Đã xóa ngân sách'),
        onError: () => toast.error('Lỗi khi xóa ngân sách'),
      });
    }
  };

  if (loadingBudgets || loadingTxs || loadingCats) return <LoadingState />;
  if (isErrorBudgets) return <ErrorState message="Lỗi khi tải danh sách ngân sách" onRetry={refetchBudgets} />;

  // Calculate spent amount for a budget based on transactions
  const getSpentForBudget = (b: any) => {
    return transactions
      .filter((tx) => {
        if (tx.type !== 'EXPENSE') return false;
        
        // If budget specifies category, filter by it
        if (b.categoryId && tx.categoryId !== b.categoryId) return false;
        
        // Match month
        const txMonth = tx.occurredAt.slice(0, 7);
        return txMonth === b.month;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);
  };

  return (
    <div className="space-y-5 animate-slide-up">
      <PageHeader
        title={t('nav.budgets')}
        actions={<Button size="sm" onClick={modal.open}><Plus size={14} />Thêm ngân sách</Button>}
      />

      {budgets.length === 0 ? (
        <EmptyState
          icon={<Calendar size={24} />}
          title="Chưa thiết lập ngân sách nào"
          action={<Button size="sm" onClick={modal.open}>Thêm ngân sách đầu tiên</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {budgets.map((b) => {
            const spent = getSpentForBudget(b);
            const pct = Math.min((spent / b.amount) * 100, 100);
            const variant = pct >= 90 ? 'danger' : pct >= 70 ? 'warning' : 'success';
            const categoryObj = categories.find((c) => c.id === b.categoryId);

            return (
              <Card key={b.id} className="card-glow p-4 space-y-3 relative group bg-card">
                <button
                  onClick={(e) => handleDelete(b.id, e)}
                  className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-destructive hover:bg-secondary/40 rounded transition-opacity opacity-0 group-hover:opacity-100"
                  title="Xóa ngân sách"
                >
                  <Trash2 size={13} />
                </button>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">{b.name}</p>
                    {categoryObj && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">Danh mục: {categoryObj.name}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mr-6 sm:mr-0">
                    <Badge variant="muted" className="text-[10px] font-mono">{b.month}</Badge>
                    <Badge variant={variant} className="text-[10px]">{pct.toFixed(0)}%</Badge>
                  </div>
                </div>

                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : '#38bdf8' }}
                  />
                </div>

                <div className="flex justify-between text-xs text-muted-foreground pt-1">
                  <span>Đã chi: {formatMoney(spent, 'VND')}</span>
                  <span>Giới hạn: {formatMoney(b.amount, 'VND')}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modal.isOpen} onClose={modal.close} title="Tạo ngân sách chi tiêu">
        <div className="space-y-4">
          <Input
            label="Tên ngân sách"
            placeholder="Ví dụ: Ăn uống hàng tháng, Tiền nhà..."
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />

          <Select
            label="Danh mục chi tiêu áp dụng (Không bắt buộc)"
            options={[
              { value: '', label: '-- Tất cả danh mục --' },
              ...categories
                .filter((c) => c.type === 'EXPENSE')
                .map((c) => ({ value: c.id, label: c.name })),
            ]}
            value={formCategoryId}
            onChange={(e) => setFormCategoryId(e.target.value)}
          />

          <Input
            label="Hạn mức ngân sách (VND)"
            type="number"
            placeholder="5,000,000"
            value={formAmount}
            onChange={(e) => setFormAmount(e.target.value)}
          />

          <Input
            label="Tháng áp dụng"
            type="month"
            value={formMonth}
            onChange={(e) => setFormMonth(e.target.value)}
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
