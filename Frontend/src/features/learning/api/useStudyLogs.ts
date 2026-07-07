import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import {
  learningControllerListL,
  learningControllerCreateL,
  learningControllerStats,
} from '@/shared/api/generated/mylife';

export function useStudyLogs(params?: any) {
  return useQuery({
    queryKey: ['learning', 'study-logs', params],
    queryFn: () => learningControllerListL(params),
  });
}

export function useCreateStudyLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: any) => learningControllerCreateL(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_SUMMARY });
    },
  });
}

export function useLearningStats() {
  return useQuery({
    queryKey: ['learning', 'statistics'],
    queryFn: () => learningControllerStats(),
  });
}
