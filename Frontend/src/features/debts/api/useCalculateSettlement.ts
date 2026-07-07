import { useMutation, useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { debtsControllerCalculate } from '@/shared/api/generated/mylife';

export function useCalculateSettlement() {
  return useMutation({
    mutationFn: () => debtsControllerCalculate(),
  });
}
