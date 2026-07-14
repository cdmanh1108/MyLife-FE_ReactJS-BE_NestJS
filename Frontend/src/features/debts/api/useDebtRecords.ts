import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import {
  debtsControllerListRecords,
  debtsControllerCreateRecord,
  debtsControllerSettle,
  debtsControllerCalculate,
  debtsControllerUpdateRecord,
  debtsControllerDeleteRecord,
} from '@/shared/api/generated/mylife';

export function useDebtRecords(params?: any) {
  return useQuery({
    queryKey: QUERY_KEYS.DEBT_RECORDS(params),
    queryFn: () => debtsControllerListRecords(params),
  });
}

export function useCreateDebtRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: any) => debtsControllerCreateRecord(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_SUMMARY });
    },
  });
}

export function useUpdateDebtRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: any }) => debtsControllerUpdateRecord(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_SUMMARY });
    },
  });
}

export function useDeleteDebtRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => debtsControllerDeleteRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_SUMMARY });
    },
  });
}

export function useSettleDebtRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => debtsControllerSettle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_SUMMARY });
    },
  });
}

export function useDebtCalculation() {
  return useQuery({
    queryKey: ['debts', 'calculation'],
    queryFn: () => debtsControllerCalculate(),
  });
}

