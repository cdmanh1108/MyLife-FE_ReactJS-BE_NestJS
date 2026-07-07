import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import {
  goalsControllerList,
  goalsControllerCreate,
  goalsControllerUpdate,
  goalsControllerRemove,
  goalsControllerAddM,
  goalsControllerUpdM,
  goalsControllerDelM,
} from '@/shared/api/generated/mylife';

export function useGoals(params?: any) {
  return useQuery({
    queryKey: QUERY_KEYS.GOALS,
    queryFn: () => goalsControllerList(params),
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: any) => goalsControllerCreate(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GOALS });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: any }) => goalsControllerUpdate(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GOALS });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => goalsControllerRemove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GOALS });
    },
  });
}

export function useAddMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ goalId, dto }: { goalId: string; dto: any }) => goalsControllerAddM(goalId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GOALS });
    },
  });
}

export function useUpdateMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ goalId, milestoneId, dto }: { goalId: string; milestoneId: string; dto: any }) =>
      goalsControllerUpdM(goalId, milestoneId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GOALS });
    },
  });
}

export function useDeleteMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ goalId, milestoneId }: { goalId: string; milestoneId: string }) =>
      goalsControllerDelM(goalId, milestoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GOALS });
    },
  });
}
