import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Edit2, BookOpen, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Avatar } from '@/shared/ui/Avatar';
import { Badge } from '@/shared/ui/Badge';
import { LoadingState } from '@/shared/ui/LoadingState';
import { ROUTES } from '@/shared/constants/routes';
import { useAuth } from '@/shared/hooks/useAuth';
import { useBiography } from '@/features/profile/api/useProfile';
import { useTransactions } from '@/features/finance/api/useTransactions';
import { useVocabulary } from '@/features/learning/api/useVocabulary';
import { useJournalEntries } from '@/features/journal/api/useJournalEntries';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Queries
  const { data: biography, isLoading: loadingBio } = useBiography();
  const { data: transactions = [], isLoading: loadingTxs } = useTransactions({ limit: 100 });
  const { data: vocab = [], isLoading: loadingVocab } = useVocabulary({ limit: 100 });
  const { data: journal = [], isLoading: loadingJournal } = useJournalEntries({ limit: 100 });

  if (!user || loadingBio || loadingTxs || loadingVocab || loadingJournal) {
    return <LoadingState />;
  }

  const stats = [
    { label: t('nav.transactions'), value: transactions.length },
    { label: t('nav.vocabulary'), value: vocab.length },
    { label: t('nav.journal'), value: journal.length },
  ];

  return (
    <div className="space-y-5 animate-slide-up max-w-2xl">
      <PageHeader
        title={t('profile.title')}
        actions={
          <Button size="sm" variant="outline" onClick={() => navigate(ROUTES.SETTINGS)}>
            <Edit2 size={14} />{t('nav.settings')}
          </Button>
        }
      />

      <Card className="card-glow">
        <div className="flex items-center gap-5">
          <Avatar name={user.name ?? 'User'} src={user.avatar} size="lg" />
          <div>
            <h2 className="text-xl font-semibold text-foreground">{user.name ?? t('profile.defaultUser')}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
            <div className="flex gap-1.5 mt-2">
              <Badge variant="info">Software Engineer</Badge>
              <Badge variant="muted">TOPIK Learner</Badge>
            </div>
          </div>
        </div>
      </Card>

      <Card className="card-glow cursor-pointer" onClick={() => navigate(ROUTES.PROFILE_BIOGRAPHY)}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2"><BookOpen size={14} />{t('nav.biography')}</CardTitle>
          <ArrowRight size={14} className="text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {biography?.content ?? t('profile.noBiography')}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="text-center p-4">
            <p className="text-2xl font-semibold font-mono text-primary">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
