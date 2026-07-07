import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '@/shared/constants/languages';
import { storage } from '@/shared/lib/storage';
import { cn } from '@/shared/lib/cn';
import type { Language } from '@/types';

export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as Language;

  const handleChange = (lang: Language) => {
    i18n.changeLanguage(lang);
    storage.set('language', lang);
  };

  return (
    <div className={cn('flex items-center gap-1 rounded-lg border border-border bg-secondary p-1', className)}>
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleChange(lang.code)}
          className={cn(
            'flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition-all duration-200',
            currentLang === lang.code
              ? 'bg-primary text-primary-foreground shadow'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <span>{lang.flag}</span>
          <span className="hidden sm:inline">{lang.code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}
