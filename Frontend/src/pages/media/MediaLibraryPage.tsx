import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Trash2 } from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { useMediaAssets, useUploadMedia, useDeleteMediaAsset } from '@/features/media/api/useMediaAssets';
import { toast } from 'sonner';

export default function MediaLibraryPage() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: media = [], isLoading, isError, refetch } = useMediaAssets();
  const uploadMutation = useUploadMedia();
  const deleteMutation = useDeleteMediaAsset();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    uploadMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Đã tải lên hình ảnh');
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      onError: () => {
        toast.error('Lỗi khi tải ảnh lên');
      },
    });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc chắn muốn xóa ảnh này?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success('Đã xóa thành công'),
        onError: () => toast.error('Lỗi khi xóa ảnh'),
      });
    }
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message="Lỗi khi tải thư viện ảnh" onRetry={refetch} />;

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

      {media.length === 0 ? (
        <EmptyState
          icon={<Upload size={24} />}
          title="Chưa có hình ảnh nào"
          action={<Button size="sm" onClick={handleUploadClick}>Tải lên ảnh đầu tiên</Button>}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {media.map((m) => (
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
                    title="Xóa ảnh"
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
    </div>
  );
}
