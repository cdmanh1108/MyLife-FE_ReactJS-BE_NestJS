import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/shared/constants/queryKeys';
import {
  mediaControllerList,
  mediaControllerRemove,
  mediaControllerUpload,
  mediaControllerAlbums,
  mediaControllerCreateAlbum,
  mediaControllerUpdateAlbum,
  mediaControllerDeleteAlbum,
} from '@/shared/api/generated/mylife';

export function useMediaAssets(params?: any) {
  return useQuery({
    queryKey: QUERY_KEYS.MEDIA_ASSETS(params),
    queryFn: () => mediaControllerList(params),
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { file: Blob; albumId?: string; tags?: string[]; takenAt?: string }) =>
      mediaControllerUpload(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

export function useDeleteMediaAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mediaControllerRemove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

export function useAlbums() {
  return useQuery({
    queryKey: QUERY_KEYS.MEDIA_ALBUMS,
    queryFn: () => mediaControllerAlbums(),
  });
}

export function useCreateAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: any) => mediaControllerCreateAlbum(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEDIA_ALBUMS });
    },
  });
}

export function useUpdateAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: any }) => mediaControllerUpdateAlbum(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEDIA_ALBUMS });
    },
  });
}

export function useDeleteAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mediaControllerDeleteAlbum(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MEDIA_ALBUMS });
    },
  });
}
