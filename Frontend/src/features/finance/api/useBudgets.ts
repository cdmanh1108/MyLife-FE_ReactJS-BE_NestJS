import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import {
  financeControllerListBudgets,
  financeControllerCreateBudget,
  financeControllerDeleteBudget,
} from '@/shared/api/generated/mylife';

export function useBudgets() {
  return useQuery({
    queryKey: ['finance', 'budgets'],
    queryFn: () => financeControllerListBudgets(),
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: { categoryId: string; limit: number; period?: string }) =>
      financeControllerCreateBudget(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance', 'budgets'] });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => financeControllerDeleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance', 'budgets'] });
    },
  });
}
