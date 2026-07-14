import { BriefcaseBusiness } from 'lucide-react';
import type { ExperienceItem } from '../portfolio.types';

interface ExperienceTimelineProps {
  items: ExperienceItem[];
}

export function ExperienceTimeline({ items }: ExperienceTimelineProps) {
  return (
    <div className="relative">
      <div className="absolute bottom-4 left-[11px] top-4 w-px bg-gradient-to-b from-primary/50 via-border to-transparent sm:left-[171px]" />

      <div className="space-y-8">
        {items.map((item, index) => (
          <article
            key={`${item.company}-${item.position}-${item.startDate}`}
            className="relative grid gap-4 pl-10 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-8 sm:pl-0"
          >
            <div className="sm:pt-1 sm:text-right">
              <p className="font-mono text-xs font-medium text-muted-foreground">
                {item.startDate} – {item.endDate}
              </p>
            </div>

            <span className="absolute left-0 top-0 flex size-6 items-center justify-center rounded-full border border-primary/40 bg-background text-primary shadow-[0_0_16px_rgba(56,189,248,0.2)] sm:left-[160px]">
              <BriefcaseBusiness size={12} aria-hidden="true" />
            </span>

            <div className="rounded-xl border border-border bg-card/80 p-5 transition-colors hover:border-primary/20 sm:p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">{item.position}</h3>
                <p className="mt-1 text-sm font-medium text-primary">{item.company}</p>
              </div>

              <ul className="space-y-2.5 text-sm leading-6 text-muted-foreground">
                {item.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3">
                    <span className="mt-[10px] size-1.5 shrink-0 rounded-full bg-primary/70" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {index === items.length - 1 && (
              <span className="sr-only">End of professional experience timeline</span>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
