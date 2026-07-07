import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import {
  learningControllerListT,
  learningControllerCreateT,
  learningControllerUpdateT,
  learningControllerDelT,
} from '@/shared/api/generated/mylife';

export function useMockTests(params?: any) {
  return useQuery({
    queryKey: ['learning', 'mock-tests', params],
    queryFn: () => learningControllerListT(params),
  });
}

export function useCreateMockTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: any) => learningControllerCreateT(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_SUMMARY });
    },
  });
}

export function useUpdateMockTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: any }) => learningControllerUpdateT(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_SUMMARY });
    },
  });
}

export function useDeleteMockTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => learningControllerDelT(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_SUMMARY });
    },
  });
}
