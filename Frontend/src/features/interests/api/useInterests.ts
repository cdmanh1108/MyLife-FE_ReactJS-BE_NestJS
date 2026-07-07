import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import {
  interestsControllerList,
  interestsControllerCreate,
  interestsControllerUpdate,
  interestsControllerRemove,
} from '@/shared/api/generated/mylife';

export function useInterests(params?: any) {
  return useQuery({
    queryKey: QUERY_KEYS.INTERESTS,
    queryFn: () => interestsControllerList(params),
  });
}

export function useCreateInterest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: any) => interestsControllerCreate(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTERESTS });
    },
  });
}

export function useUpdateInterest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: any }) => interestsControllerUpdate(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTERESTS });
    },
  });
}

export function useDeleteInterest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => interestsControllerRemove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INTERESTS });
    },
  });
}
