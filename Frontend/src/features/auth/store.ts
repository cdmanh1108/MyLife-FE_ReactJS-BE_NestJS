import { create } from 'zustand';
import type { User } from '@/types';
import { storage } from '@/shared/lib/storage';
import { apiClient } from '@/shared/api/client';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: storage.get<string>('accessToken'),
  refreshToken: storage.get<string>('refreshToken'),
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await apiClient.post<any>('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = res;

      storage.set('accessToken', accessToken);
      storage.set('refreshToken', refreshToken);

      const mappedUser: User = {
        id: user.id,
        email: user.email,
        name: user.displayName || user.name || '',
        avatar: user.avatarUrl || user.avatar || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      set({
        user: mappedUser,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // ignore network errors during logout
    }
    storage.remove('accessToken');
    storage.remove('refreshToken');
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  fetchMe: async () => {
    const accessToken = storage.get<string>('accessToken');
    if (!accessToken) {
      set({ isLoading: false, isAuthenticated: false, user: null });
      return;
    }
    set({ isLoading: true });
    try {
      const user = await apiClient.get<any>('/auth/me');
      const mappedUser: User = {
        id: user.id,
        email: user.email,
        name: user.displayName || user.name || '',
        avatar: user.avatarUrl || user.avatar || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      set({
        user: mappedUser,
        accessToken,
        refreshToken: storage.get<string>('refreshToken'),
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      // If the interceptor clears token upon refresh failure, clear store
      storage.remove('accessToken');
      storage.remove('refreshToken');
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  refreshAuth: async () => {
    const refreshToken = storage.get<string>('refreshToken');
    if (!refreshToken) return false;
    try {
      const res = await apiClient.post<any>('/auth/refresh', { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = res;
      storage.set('accessToken', accessToken);
      storage.set('refreshToken', newRefreshToken);
      set({
        accessToken,
        refreshToken: newRefreshToken,
      });
      return true;
    } catch {
      storage.remove('accessToken');
      storage.remove('refreshToken');
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
      return false;
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));

