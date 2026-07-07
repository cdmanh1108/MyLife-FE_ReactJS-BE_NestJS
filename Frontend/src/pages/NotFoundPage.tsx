import { useNavigate } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';
import { Button } from '@/shared/ui/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center">
      <p className="text-7xl font-mono font-bold text-primary/20">404</p>
      <p className="text-xl font-semibold text-foreground">Trang không tồn tại</p>
      <p className="text-sm text-muted-foreground">Trang bạn tìm kiếm đã bị xóa hoặc không tồn tại.</p>
      <Button onClick={() => navigate(ROUTES.DASHBOARD)}>Về Dashboard</Button>
    </div>
  );
}
