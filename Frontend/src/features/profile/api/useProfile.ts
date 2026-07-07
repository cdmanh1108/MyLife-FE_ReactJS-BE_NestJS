import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import {
  profileControllerGetMe,
  profileControllerUpdateMe,
  profileControllerGetBiography,
  profileControllerUpdateBiography,
} from '@/shared/api/generated/mylife';
import { useAuthStore } from '@/features/auth/store';

export function useProfile() {
  return useQuery({
    queryKey: QUERY_KEYS.PROFILE,
    queryFn: () => profileControllerGetMe(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { fetchMe } = useAuthStore();

  return useMutation({
    mutationFn: (dto: any) => profileControllerUpdateMe(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROFILE });
      fetchMe(); // reload profile in auth store
    },
  });
}

export function useBiography() {
  return useQuery({
    queryKey: QUERY_KEYS.BIOGRAPHY,
    queryFn: () => profileControllerGetBiography(),
  });
}

export function useUpdateBiography() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: { content: string }) => profileControllerUpdateBiography(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BIOGRAPHY });
    },
  });
}
