import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Trash2 } from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { useMediaAssets, useUploadMedia, useDeleteMediaAsset } from '@/features/media/api/useMediaAssets';
import { toast } from 'sonner';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';

export default function MediaLibraryPage() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useMediaAssets();
  const mediaItems = data ?? [];
  const uploadMutation = useUploadMedia();
  const deleteMutation = useDeleteMediaAsset();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadMutation.mutate({ file }, {
      onSuccess: () => {
        toast.success(t('media.toastUploadSuccess'));
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      onError: () => {
        toast.error(t('media.toastUploadError'));
      },
    });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={t('media.errorLoad')} onRetry={refetch} />;

  return (
    <div className="space-y-5 animate-slide-up">
      <PageHeader
        title={t('media.title')}
        actions={
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <Button size="sm" onClick={handleUploadClick} loading={uploadMutation.isPending}>
              <Upload size={14} />{t('media.upload')}
            </Button>
          </>
        }
      />

      {mediaItems.length === 0 ? (
        <EmptyState
          icon={<Upload size={24} />}
          title={t('media.noMedia')}
          action={<Button size="sm" onClick={handleUploadClick}>{t('media.uploadFirstPhoto')}</Button>}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {mediaItems.map((m) => (
            <div key={m.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-secondary cursor-pointer">
              <img
                src={m.url.startsWith('http') ? m.url : `http://localhost:3000${m.url}`}
                alt={m.filename}
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-end">
                  <button
                    onClick={(e) => handleDelete(m.id, e)}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-secondary/40 rounded-md transition-colors"
                    title={t('media.deletePhoto')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="text-xs text-white truncate">{m.filename}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteMutation.mutate(deleteId, {
              onSuccess: () => {
                toast.success(t('media.toastDeleteSuccess'));
                setDeleteId(null);
              },
              onError: () => toast.error(t('media.toastDeleteError')),
            });
          }
        }}
        title={t('media.deletePhotoTitle')}
        description={t('confirmations.deletePhoto')}
        variant="danger"
        confirmText={t('common.delete')}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
