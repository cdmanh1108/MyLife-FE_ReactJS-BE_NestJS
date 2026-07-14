import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import {
  portfolioControllerGetOwnerPortfolio,
  portfolioControllerUpdateMyPortfolio,
} from '@/shared/api/generated/mylife';
import type { UpdatePortfolioDto } from '@/shared/api/generated/mylife';

export function usePortfolio() {
  return useQuery({
    queryKey: QUERY_KEYS.PORTFOLIO,
    queryFn: () => portfolioControllerGetOwnerPortfolio(),
  });
}

export function useUpdatePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdatePortfolioDto) => portfolioControllerUpdateMyPortfolio(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PORTFOLIO });
    },
  });
}
