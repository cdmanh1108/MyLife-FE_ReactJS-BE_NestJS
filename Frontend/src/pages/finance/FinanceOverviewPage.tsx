import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Plus, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { StatCard } from '@/shared/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { EmptyState } from '@/shared/ui/EmptyState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { ROUTES } from '@/shared/constants/routes';
import { formatMoney, formatCompactMoney } from '@/shared/lib/money';
import { formatDate } from '@/shared/lib/date';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useTransactions } from '@/features/finance/api/useTransactions';
import { useCategories } from '@/features/finance/api/useCategories';

const COLOR_PALETTE = ['#38bdf8', '#0ea5e9', '#06b6d4', '#22d3ee', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'];

export default function FinanceOverviewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Queries
  const { data: transactions = [], isLoading: loadingTxs, isError, refetch } = useTransactions({ limit: 100 });
  const { data: categories = [], isLoading: loadingCats } = useCategories();

  if (loadingTxs || loadingCats) return <LoadingState />;
  if (isError) return <ErrorState message="Lỗi khi tải dữ liệu tài chính" onRetry={refetch} />;

  // Calculate totals
  let totalIncome = 0;
  let totalExpense = 0;
  
  transactions.forEach((tx) => {
    if (tx.type === 'INCOME') {
      totalIncome += tx.amount;
    } else if (tx.type === 'EXPENSE') {
      totalExpense += tx.amount;
    }
  });

  const balance = totalIncome - totalExpense;

  // Aggregate expenses by category
  const expenseTransactions = transactions.filter((tx) => tx.type === 'EXPENSE');
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  const expenseByCategory: Record<string, number> = {};
  expenseTransactions.forEach((tx) => {
    const categoryName = tx.categoryId ? (categoryMap.get(tx.categoryId) || 'Khác') : 'Khác';
    expenseByCategory[categoryName] = (expenseByCategory[categoryName] || 0) + tx.amount;
  });

  const categoryData = Object.entries(expenseByCategory).map(([name, value], index) => ({
    name,
    value,
    color: COLOR_PALETTE[index % COLOR_PALETTE.length],
  })).sort((a, b) => b.value - a.value);

  // Get recent 5 transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-slide-up">
      <PageHeader
        title={t('finance.overview')}
        actions={
          <Button onClick={() => navigate(ROUTES.FINANCE_TRANSACTIONS)} size="sm">
            <Plus size={14} />
            {t('finance.addTransaction')}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label={t('finance.income')} value={formatCompactMoney(totalIncome, 'VND')} subValue={formatMoney(totalIncome)} icon={<TrendingUp size={18} />} variant="income" />
        <StatCard label={t('finance.expense')} value={formatCompactMoney(totalExpense, 'VND')} subValue={formatMoney(totalExpense)} icon={<TrendingDown size={18} />} variant="expense" />
        <StatCard label={t('finance.balance')} value={formatCompactMoney(balance, 'VND')} subValue={formatMoney(balance)} variant={balance >= 0 ? 'income' : 'expense'} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Chi tiêu theo danh mục</CardTitle></CardHeader>
          <CardContent>
            {categoryData.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-8">Chưa ghi nhận chi tiêu nào</p>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <ResponsiveContainer width={160} height={160} className="flex-shrink-0">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value">
                      {categoryData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => formatCompactMoney(v, 'VND')} contentStyle={{ backgroundColor: '#0d1526', border: '1px solid rgba(56,189,248,0.1)', borderRadius: '8px', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 w-full space-y-2.5">
                  {categoryData.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="size-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-xs text-muted-foreground">{cat.name}</span>
                      </div>
                      <span className="text-xs font-mono text-foreground font-medium">{formatMoney(cat.value, 'VND')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Giao dịch gần đây</CardTitle>
            <button onClick={() => navigate(ROUTES.FINANCE_TRANSACTIONS)} className="text-xs text-primary hover:underline flex items-center gap-1">
              Xem tất cả <ArrowRight size={11} />
            </button>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-8">Chưa có giao dịch nào</p>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((tx) => {
                  const categoryName = tx.categoryId ? (categoryMap.get(tx.categoryId) || 'Giao dịch') : 'Giao dịch';
                  const isIncome = tx.type === 'INCOME';
                  return (
                    <div key={tx.id} className="flex items-center justify-between gap-2 border-b border-border/20 pb-2 last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{categoryName}</p>
                        <p className="text-[10px] text-muted-foreground">{formatDate(tx.occurredAt)}</p>
                      </div>
                      <span className={`text-xs font-mono font-semibold flex-shrink-0 ${isIncome ? 'text-green-400' : 'text-red-400'}`}>
                        {isIncome ? '+' : '-'}{formatCompactMoney(tx.amount, 'VND')}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
