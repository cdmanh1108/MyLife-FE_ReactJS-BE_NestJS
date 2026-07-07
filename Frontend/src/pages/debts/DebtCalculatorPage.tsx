import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { LoadingState } from '@/shared/ui/LoadingState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ArrowRight, Calculator } from 'lucide-react';
import { formatMoney } from '@/shared/lib/money';
import { useDebtCalculation } from '@/features/debts/api/useDebtRecords';

export default function DebtCalculatorPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useDebtCalculation();

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message="Lỗi khi tính toán công nợ" onRetry={refetch} />;

  const positions = data?.byPerson ?? [];

  return (
    <div className="space-y-5 animate-slide-up">
      <PageHeader title={t('nav.calculator')} />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator size={14} />
            {t('debts.settlement')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {positions.length === 0 ? (
            <EmptyState
              icon={<Calculator size={24} />}
              title="Đã sòng phẳng!"
              description="Hiện tại không có khoản nợ nào chưa thanh toán."
            />
          ) : (
            <>
              <div className="space-y-3">
                {positions.map((pos: any, i: number) => {
                  const isIOwe = pos.direction === 'I_OWE';
                  const from = isIOwe ? 'Tôi' : pos.personName;
                  const to = isIOwe ? pos.personName : 'Tôi';
                  return (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-secondary p-3">
                      <Badge variant={isIOwe ? 'danger' : 'success'}>{from}</Badge>
                      <ArrowRight size={14} className="text-muted-foreground" />
                      <Badge variant={isIOwe ? 'success' : 'danger'}>{to}</Badge>
                      <span className="ml-auto font-mono text-sm text-foreground">
                        {formatMoney(pos.amount, pos.currency ?? 'VND')}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Danh sách tổng hợp các khoản nợ cần thanh toán để đưa số dư công nợ về bằng 0.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
