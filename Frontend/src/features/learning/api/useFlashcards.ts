import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import {
  learningControllerListF,
  learningControllerCreateF,
  learningControllerUpdateF,
  learningControllerDelF,
  learningControllerReviewF,
} from '@/shared/api/generated/mylife';

export function useFlashcards(params?: any) {
  return useQuery({
    queryKey: ['learning', 'flashcards', params],
    queryFn: () => learningControllerListF(params),
  });
}

export function useCreateFlashcard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: any) => learningControllerCreateF(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning'] });
    },
  });
}

export function useUpdateFlashcard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: any }) => learningControllerUpdateF(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning'] });
    },
  });
}

export function useDeleteFlashcard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => learningControllerDelF(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning'] });
    },
  });
}

export function useReviewFlashcard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, nextReviewAt }: { id: string; status: string; nextReviewAt?: string }) =>
      learningControllerReviewF(id, { status, nextReviewAt }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning'] });
    },
  });
}
