import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import { debtsControllerListPeople, debtsControllerCreatePerson, debtsControllerDeletePerson } from '@/shared/api/generated/mylife';

export function useDebtPeople() {
  return useQuery({
    queryKey: QUERY_KEYS.DEBT_PEOPLE,
    queryFn: () => debtsControllerListPeople(),
  });
}

export function useCreateDebtPerson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: any) => debtsControllerCreatePerson(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEBT_PEOPLE });
    },
  });
}

export function useDeleteDebtPerson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => debtsControllerDeletePerson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEBT_PEOPLE });
    },
  });
}
