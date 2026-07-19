import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, Wallet, CreditCard, Target, CheckSquare, Clock,
  BookOpen, Image, Heart, GraduationCap, User, Settings,
  Users, Calculator, BookMarked, FileText, FolderOpen,
  Briefcase, Trophy, BookText
} from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/lib/cn';
import { useAuth } from '@/shared/hooks/useAuth';
import { Avatar } from '@/shared/ui/Avatar';

import type { ReactNode } from 'react';

interface NavItem {
  label: string;
  icon: ReactNode;
  to: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const groups: NavGroup[] = [
    {
      label: '',
      items: [
        { label: t('nav.dashboard'), icon: <LayoutDashboard size={16} />, to: ROUTES.DASHBOARD },
      ],
    },
    {
      label: t('finance.title'),
      items: [
        { label: t('nav.finance'), icon: <Wallet size={16} />, to: ROUTES.FINANCE },
        { label: t('nav.transactions'), icon: <CreditCard size={16} />, to: ROUTES.FINANCE_TRANSACTIONS },
        { label: t('nav.budgets'), icon: <Target size={16} />, to: ROUTES.FINANCE_BUDGETS },
      ],
    },
    {
      label: t('debts.title'),
      items: [
        { label: t('nav.debts'), icon: <Briefcase size={16} />, to: ROUTES.DEBTS },
        { label: t('nav.people'), icon: <Users size={16} />, to: ROUTES.DEBTS_PEOPLE },
        { label: t('nav.calculator'), icon: <Calculator size={16} />, to: ROUTES.DEBTS_CALCULATOR },
      ],
    },
    {
      label: t('common.appName'),
      items: [
        { label: t('nav.todos'), icon: <CheckSquare size={16} />, to: ROUTES.TODOS },
        { label: t('nav.goals'), icon: <Trophy size={16} />, to: ROUTES.GOALS },
        { label: t('nav.timeline'), icon: <Clock size={16} />, to: ROUTES.TIMELINE },
        { label: t('nav.journal'), icon: <BookOpen size={16} />, to: ROUTES.JOURNAL },
        { label: t('nav.media'), icon: <Image size={16} />, to: ROUTES.MEDIA },
        { label: t('nav.interests'), icon: <Heart size={16} />, to: ROUTES.INTERESTS },
      ],
    },
    {
      label: t('learning.title'),
      items: [
        { label: t('nav.learning'), icon: <GraduationCap size={16} />, to: ROUTES.LEARNING },
        { label: t('nav.vocabulary'), icon: <BookText size={16} />, to: ROUTES.LEARNING_VOCABULARY },
        { label: t('nav.flashcards'), icon: <BookMarked size={16} />, to: ROUTES.LEARNING_FLASHCARDS },
        { label: t('nav.mockTests'), icon: <FileText size={16} />, to: ROUTES.LEARNING_MOCK_TESTS },
        { label: t('nav.studyPlan'), icon: <FolderOpen size={16} />, to: ROUTES.LEARNING_STUDY_PLAN },
      ],
    },
    {
      label: t('profile.title'),
      items: [
        { label: t('nav.profile'), icon: <User size={16} />, to: ROUTES.PROFILE },
        { label: t('nav.settings'), icon: <Settings size={16} />, to: ROUTES.SETTINGS },
      ],
    },
  ];

  return (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary/15 border border-primary/25">
          <span className="text-xs font-bold text-primary font-mono">ML</span>
        </div>
        <span className="font-semibold text-foreground text-sm tracking-wide">{t('common.appName')}</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {groups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === ROUTES.FINANCE || item.to === ROUTES.DEBTS || item.to === ROUTES.LEARNING}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all duration-150',
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/15'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border border-transparent'
                    )
                  }
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      {user && (
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <Avatar name={user.name} src={user.avatar} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
