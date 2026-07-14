import { Menu, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { useAuth } from '@/shared/hooks/useAuth';
import { Avatar } from '@/shared/ui/Avatar';
import { formatDate } from '@/shared/lib/date';

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const today = formatDate(new Date(), 'EEEE, dd/MM/yyyy');

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-4 gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors lg:hidden"
        >
          <Menu size={18} />
        </button>
        <p className="text-xs text-muted-foreground hidden sm:block font-mono">{today}</p>
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
        <button className="relative flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
          <Bell size={16} />
          <span className="absolute top-1 right-1 size-1.5 rounded-full bg-primary" />
        </button>
        {user && <Avatar name={user.name} src={user.avatar} size="sm" />}
      </div>
    </header>
  );
}
