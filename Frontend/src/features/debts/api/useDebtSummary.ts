import { useQuery } from '@tanstack/react-query';
import { debtsControllerSummary } from '@/shared/api/generated/mylife';

export function useDebtSummary() {
  return useQuery({
    queryKey: ['debts', 'summary'],
    queryFn: () => debtsControllerSummary(),
  });
}
