import { type ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  variant?: 'default' | 'income' | 'expense' | 'warning';
  className?: string;
}

const variants = {
  default: 'border-border',
  income: 'border-green-500/20',
  expense: 'border-red-500/20',
  warning: 'border-yellow-500/20',
};

const iconVariants = {
  default: 'bg-primary/10 text-primary',
  income: 'bg-green-500/10 text-green-400',
  expense: 'bg-red-500/10 text-red-400',
  warning: 'bg-yellow-500/10 text-yellow-400',
};

export function StatCard({ label, value, subValue, icon, trend, trendLabel, variant = 'default', className }: StatCardProps) {
  return (
    <Card className={cn('card-glow', variants[variant], className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
          <p className="text-2xl font-semibold text-foreground font-mono tabular-nums truncate">{value}</p>
          {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
          {trendLabel && (
            <p className={cn('text-xs mt-1.5', trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-muted-foreground')}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'} {trendLabel}
            </p>
          )}
        </div>
        {icon && (
          <div className={cn('flex size-10 flex-shrink-0 items-center justify-center rounded-lg', iconVariants[variant])}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
