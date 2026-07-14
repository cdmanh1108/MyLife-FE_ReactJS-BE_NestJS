import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';
import { Button } from '@/shared/ui/Button';
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar with controls */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15 border border-primary/20">
            <span className="text-sm font-bold text-primary font-mono">ML</span>
          </div>
          <span className="font-semibold text-foreground text-sm">{t('common.appName')}</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      {/* Hero section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-16 animate-slide-up">
        <div className="mb-6 relative">
          <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mx-auto">
            <span className="text-3xl font-bold text-primary font-mono">ML</span>
          </div>
          <div className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-primary">
            <Sparkles size={12} className="text-primary-foreground" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-semibold text-foreground mb-3 tracking-tight">
          MyLife OS
        </h1>
        <p className="text-muted-foreground max-w-sm mx-auto mb-10 leading-relaxed">
          {t('landing.description')}
        </p>

        <Button size="lg" onClick={() => navigate(ROUTES.LOGIN)} className="gap-2 px-8">
          {t('landing.getStarted')}
          <ArrowRight size={16} />
        </Button>

        {/* Feature tags */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {['Finance', 'Journal', 'Goals', 'Learning', 'Timeline'].map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono text-primary/60 border border-primary/15 rounded-md px-2.5 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      </main>
    </div>
  );
}
