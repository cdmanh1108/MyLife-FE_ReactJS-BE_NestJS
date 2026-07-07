import { type ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { fetchMe, logout } = useAuthStore();

  useEffect(() => {
    fetchMe();

    const handleLogout = () => logout();
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  return <>{children}</>;
}
