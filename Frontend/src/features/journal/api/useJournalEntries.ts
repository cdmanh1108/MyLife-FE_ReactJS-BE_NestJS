import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import {
  journalControllerList,
  journalControllerCreate,
  journalControllerUpdate,
  journalControllerRemove,
  journalControllerStats,
} from '@/shared/api/generated/mylife';

export function useJournalEntries(params?: any) {
  return useQuery({
    queryKey: QUERY_KEYS.JOURNAL_ENTRIES(params),
    queryFn: () => journalControllerList(params),
  });
}

export function useCreateJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: any) => journalControllerCreate(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_SUMMARY });
    },
  });
}

export function useUpdateJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: any }) => journalControllerUpdate(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_SUMMARY });
    },
  });
}

export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => journalControllerRemove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_SUMMARY });
    },
  });
}

export function useJournalStats() {
  return useQuery({
    queryKey: ['journal', 'stats'],
    queryFn: () => journalControllerStats(),
  });
}
