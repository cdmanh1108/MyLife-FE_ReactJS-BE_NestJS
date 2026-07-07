import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { dashboardControllerSummary } from '@/shared/api/generated/mylife';

export function useDashboardSummary() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_SUMMARY,
    queryFn: () => dashboardControllerSummary(),
  });
}
