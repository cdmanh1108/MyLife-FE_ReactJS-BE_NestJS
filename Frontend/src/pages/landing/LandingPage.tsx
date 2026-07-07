import { useNavigate } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';
import { Button } from '@/shared/ui/Button';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
      <div className="animate-slide-up">
        <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mx-auto">
          <span className="text-2xl font-bold text-primary font-mono">ML</span>
        </div>
        <h1 className="text-4xl font-semibold text-foreground mb-3">MyLife OS</h1>
        <p className="text-muted-foreground max-w-sm mx-auto mb-8">
          Hệ thống quản lý cuộc sống cá nhân. Tài chính, nhật ký, học tập, mục tiêu — tất cả trong một nơi.
        </p>
        <Button size="lg" onClick={() => navigate(ROUTES.LOGIN)}>
          Bắt đầu <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
