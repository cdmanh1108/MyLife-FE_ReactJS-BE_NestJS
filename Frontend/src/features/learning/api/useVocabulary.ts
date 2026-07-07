import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import {
  learningControllerListV,
  learningControllerCreateV,
  learningControllerUpdateV,
  learningControllerDelV,
} from '@/shared/api/generated/mylife';

export function useVocabulary(params?: any) {
  return useQuery({
    queryKey: QUERY_KEYS.VOCABULARY(params),
    queryFn: () => learningControllerListV(params),
  });
}

export function useCreateVocabulary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: any) => learningControllerCreateV(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_SUMMARY });
    },
  });
}

export function useUpdateVocabulary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: any }) => learningControllerUpdateV(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_SUMMARY });
    },
  });
}

export function useDeleteVocabulary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => learningControllerDelV(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_SUMMARY });
    },
  });
}
