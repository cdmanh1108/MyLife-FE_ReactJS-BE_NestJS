import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn('flex items-center gap-1 rounded-lg border border-border bg-secondary p-1 h-[36px] w-[64px] opacity-40', className)} />
    );
  }

  return (
    <div className={cn('flex items-center gap-1 rounded-lg border border-border bg-secondary p-1', className)}>
      <button
        onClick={() => setTheme('light')}
        className={cn(
          'flex size-7 items-center justify-center rounded transition-all duration-200 cursor-pointer',
          theme === 'light'
            ? 'bg-primary text-primary-foreground shadow'
            : 'text-muted-foreground hover:text-foreground'
        )}
        title="Light Theme"
      >
        <Sun size={14} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={cn(
          'flex size-7 items-center justify-center rounded transition-all duration-200 cursor-pointer',
          theme === 'dark'
            ? 'bg-primary text-primary-foreground shadow'
            : 'text-muted-foreground hover:text-foreground'
        )}
        title="Dark Theme"
      >
        <Moon size={14} />
      </button>
    </div>
  );
}
export default ThemeToggle;
