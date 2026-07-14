import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface PortfolioSectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PortfolioSection({
  id,
  eyebrow,
  title,
  description,
  icon,
  children,
  className,
}: PortfolioSectionProps) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {eyebrow && (
            <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              {eyebrow}
            </p>
          )}
          <div className="flex items-center gap-3">
            {icon && (
              <span className="flex size-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                {icon}
              </span>
            )}
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h2>
          </div>
        </div>
        {description && (
          <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-right">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}
