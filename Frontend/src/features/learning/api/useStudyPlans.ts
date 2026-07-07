import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import {
  learningControllerListP,
  learningControllerCreateP,
  learningControllerUpdateP,
  learningControllerDelP,
} from '@/shared/api/generated/mylife';

export function useStudyPlans(params?: any) {
  return useQuery({
    queryKey: QUERY_KEYS.STUDY_PLANS,
    queryFn: () => learningControllerListP(params),
  });
}

export function useCreateStudyPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: any) => learningControllerCreateP(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning'] });
    },
  });
}

export function useUpdateStudyPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: any }) => learningControllerUpdateP(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning'] });
    },
  });
}

export function useDeleteStudyPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => learningControllerDelP(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning'] });
    },
  });
}
