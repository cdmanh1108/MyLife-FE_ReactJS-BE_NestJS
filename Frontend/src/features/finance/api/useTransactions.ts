import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import {
  financeControllerListTransactions,
  financeControllerDeleteTransaction,
  financeControllerUpdateTransaction,
} from '@/shared/api/generated/mylife';

export function useTransactions(params?: any) {
  return useQuery({
    queryKey: QUERY_KEYS.TRANSACTIONS(params),
    queryFn: () => financeControllerListTransactions(params),
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: any }) => financeControllerUpdateTransaction(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_SUMMARY });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => financeControllerDeleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_SUMMARY });
    },
  });
}

