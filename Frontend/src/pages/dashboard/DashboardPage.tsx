import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import {
  TrendingUp, TrendingDown, Wallet, Users, CheckSquare,
  BookOpen, Flame, Plus, PenLine, BookText, ListTodo,
  Smile, Clock
} from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { StatCard } from '@/shared/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { LoadingState } from '@/shared/ui/LoadingState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { ROUTES } from '@/shared/constants/routes';
import { formatMoney, formatCompactMoney } from '@/shared/lib/money';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboardSummary } from '@/features/dashboard/api/useDashboardSummary';
import { useTransactions } from '@/features/finance/api/useTransactions';

const MOOD_MAP: Record<string, { emoji: string; label: string; color: string }> = {
  HAPPY: { emoji: '😊', label: 'Vui vẻ', color: 'text-yellow-400' },
  SAD: { emoji: '😔', label: 'Buồn', color: 'text-purple-400' },
  ANGRY: { emoji: '😡', label: 'Tức giận', color: 'text-red-400' },
  TIRED: { emoji: '😫', label: 'Mệt mỏi', color: 'text-blue-400' },
  PEACEFUL: { emoji: '😌', label: 'Yên bình', color: 'text-green-400' },
  LONELY: { emoji: '🥺', label: 'Cô đơn', color: 'text-indigo-400' },
  MOTIVATED: { emoji: '🤩', label: 'Động lực', color: 'text-orange-400' },
  EMPTY: { emoji: '😐', label: 'Trống rỗng', color: 'text-slate-400' },
  OTHER: { emoji: '🤔', label: 'Khác', color: 'text-teal-400' },
  AMAZING: { emoji: '🤩', label: 'Tuyệt vời', color: 'text-yellow-400' },
  GOOD: { emoji: '😊', label: 'Tốt', color: 'text-green-400' },
  NEUTRAL: { emoji: '😐', label: 'Bình thường', color: 'text-blue-400' },
  TERRIBLE: { emoji: '😞', label: 'Tệ', color: 'text-red-400' },
};

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Queries
  const { data: summaryData, isLoading: loadingSummary, isError: isErrorSummary, refetch: refetchSummary } = useDashboardSummary();
  const { data: transactions = [], isLoading: loadingTxs } = useTransactions({ limit: 100 });

  if (loadingSummary || loadingTxs) return <LoadingState />;
  if (isErrorSummary) return <ErrorState message="Không thể tải tổng quan dữ liệu" onRetry={refetchSummary} />;

  const summary = {
    finance: {
      incomeThisMonth: (summaryData as any)?.monthlyIncome ?? 0,
      expenseThisMonth: (summaryData as any)?.monthlyExpense ?? 0,
      balance: summaryData?.balance ?? 0,
      currency: (summaryData as any)?.currency ?? 'VND',
    },
    debts: {
      totalIOwe: summaryData?.debtsIOwe ?? 0,
      totalOwedToMe: summaryData?.debtsOwedToMe ?? 0,
      currency: 'VND',
    },
    todos: {
      todayCount: summaryData?.todayCount ?? 0,
      doneToday: summaryData?.doneToday ?? 0,
    },
    learning: {
      streak: summaryData?.learningStreak ?? 0,
      language: summaryData?.learningLanguage ?? 'TOPIK',
    },
    lastMood: (summaryData?.latestMood?.mood || 'NEUTRAL').toUpperCase(),
  };

  const mood = MOOD_MAP[summary.lastMood] || MOOD_MAP.NEUTRAL;

  const quickActions = [
    { label: t('dashboard.addTransaction'), icon: <Plus size={14} />, to: ROUTES.FINANCE_TRANSACTIONS },
    { label: t('dashboard.addDebt'), icon: <Users size={14} />, to: ROUTES.DEBTS },
    { label: t('dashboard.writeJournal'), icon: <PenLine size={14} />, to: ROUTES.JOURNAL_NEW },
    { label: t('dashboard.addVocab'), icon: <BookText size={14} />, to: ROUTES.LEARNING_VOCABULARY },
    { label: t('dashboard.addTask'), icon: <ListTodo size={14} />, to: ROUTES.TODOS },
  ];

  // Dynamic calculation for income/expense over last 6 months
  const getChartData = () => {
    const data = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = d.toISOString().slice(0, 7); // YYYY-MM
      const monthLabel = `T${d.getMonth() + 1}`; // e.g. T1, T2...

      let income = 0;
      let expense = 0;

      transactions.forEach((tx) => {
        const txMonth = tx.occurredAt.slice(0, 7);
        if (txMonth === monthKey) {
          if (tx.type === 'INCOME') {
            income += tx.amount;
          } else if (tx.type === 'EXPENSE') {
            expense += tx.amount;
          }
        }
      });

      data.push({
        month: monthLabel,
        income,
        expense,
      });
    }
    return data;
  };

  const chartData = getChartData();

  return (
    <div className="space-y-6 animate-slide-up">
      <PageHeader
        title={t('dashboard.title')}
        subtitle={`${new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
      />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.quickActions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
                onClick={() => navigate(action.to)}
                className="gap-1.5"
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label={t('dashboard.incomeThisMonth')}
          value={formatCompactMoney(summary.finance.incomeThisMonth, 'VND')}
          subValue={formatMoney(summary.finance.incomeThisMonth)}
          icon={<TrendingUp size={18} />}
          variant="income"
        />
        <StatCard
          label={t('dashboard.expenseThisMonth')}
          value={formatCompactMoney(summary.finance.expenseThisMonth, 'VND')}
          subValue={formatMoney(summary.finance.expenseThisMonth)}
          icon={<TrendingDown size={18} />}
          variant="expense"
        />
        <StatCard
          label={t('dashboard.balance')}
          value={formatCompactMoney(summary.finance.balance, 'VND')}
          subValue={formatMoney(summary.finance.balance)}
          icon={<Wallet size={18} />}
          variant="default"
        />
        <StatCard
          label={t('dashboard.iOwe')}
          value={formatCompactMoney(summary.debts.totalIOwe, 'VND')}
          subValue={`${t('dashboard.owedToMe')}: ${formatCompactMoney(summary.debts.totalOwedToMe, 'VND')}`}
          icon={<Users size={18} />}
          variant="warning"
        />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Thu / Chi 6 tháng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1526', border: '1px solid rgba(56,189,248,0.1)', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#cbd5e1' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: '600' }}
                  formatter={(v: number) => [formatCompactMoney(v, 'VND'), '']}
                />
                <Area type="monotone" dataKey="income" stroke="#38bdf8" fill="url(#incomeGrad)" strokeWidth={2} dot={false} name={t('finance.income')} />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="url(#expenseGrad)" strokeWidth={2} dot={false} name={t('finance.expense')} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Side cards */}
        <div className="space-y-4">
          <Card className="card-glow">
            <CardHeader><CardTitle>{t('dashboard.todayTodos')}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold font-mono tabular-nums text-foreground">
                {summary.todos.doneToday}<span className="text-muted-foreground text-xl">/{summary.todos.todayCount}</span>
              </p>
              <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${summary.todos.todayCount > 0 ? (summary.todos.doneToday / summary.todos.todayCount) * 100 : 0}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {summary.todos.todayCount - summary.todos.doneToday} việc còn lại hôm nay
              </p>
            </CardContent>
          </Card>

          <Card className="card-glow">
            <CardHeader><CardTitle>{t('dashboard.learningStreak')}</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Flame size={24} className="text-orange-400" />
                <p className="text-3xl font-semibold font-mono text-foreground">
                  {summary.learning.streak}
                  <span className="text-base text-muted-foreground ml-1">{t('dashboard.days')}</span>
                </p>
              </div>
              <Badge variant="info" className="mt-2">{summary.learning.language}</Badge>
            </CardContent>
          </Card>

          <Card className="card-glow">
            <CardHeader><CardTitle>{t('dashboard.lastMood')}</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{mood.emoji}</span>
                <div>
                  <p className={`font-semibold ${mood.color}`}>{mood.label}</p>
                  <p className="text-xs text-muted-foreground">Hôm nay</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
