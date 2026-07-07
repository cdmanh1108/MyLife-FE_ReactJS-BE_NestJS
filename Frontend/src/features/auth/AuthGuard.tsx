import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuthStore } from './store';
import { ROUTES } from '@/shared/constants/routes';
import { PageLoader } from '@/shared/ui/LoadingState';

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;

  return <>{children}</>;
}

export function GuestGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return <PageLoader />;
  if (isAuthenticated) return <Navigate to={ROUTES.DASHBOARD} replace />;

  return <>{children}</>;
}
