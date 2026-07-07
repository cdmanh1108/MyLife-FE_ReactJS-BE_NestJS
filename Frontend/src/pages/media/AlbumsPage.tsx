import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, FolderOpen, Trash2 } from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button } from '@/shared/ui/Button';
import { Card, CardContent } from '@/shared/ui/Card';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { EmptyState } from '@/shared/ui/EmptyState';
import { LoadingState } from '@/shared/ui/LoadingState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { useAlbums, useCreateAlbum, useDeleteAlbum } from '@/features/media/api/useMediaAssets';
import { toast } from 'sonner';

export default function AlbumsPage() {
  const { t } = useTranslation();
  const modal = useDisclosure();
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const { data: albums = [], isLoading, isError, refetch } = useAlbums();
  const createMutation = useCreateAlbum();
  const deleteMutation = useDeleteAlbum();

  const handleSave = () => {
    if (!formName.trim()) {
      toast.error('Vui lòng nhập tên album');
      return;
    }
    createMutation.mutate(
      { name: formName.trim(), description: formDescription.trim() || undefined },
      {
        onSuccess: () => {
          toast.success('Đã tạo album mới');
          modal.close();
          setFormName('');
          setFormDescription('');
        },
        onError: () => toast.error('Lỗi khi tạo album'),
      }
    );
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc muốn xóa album này? Sẽ không xóa các ảnh bên trong.')) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success('Đã xóa album'),
        onError: () => toast.error('Lỗi khi xóa album'),
      });
    }
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message="Lỗi khi tải danh sách album" onRetry={refetch} />;

  return (
    <div className="space-y-5 animate-slide-up">
      <PageHeader
        title={t('nav.albums')}
        actions={<Button size="sm" onClick={modal.open}><Plus size={14} />Tạo album</Button>}
      />

      {albums.length === 0 ? (
        <EmptyState
          icon={<FolderOpen size={24} />}
          title="Chưa có album nào"
          action={<Button size="sm" onClick={modal.open}><Plus size={14} />Tạo album đầu tiên</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <div key={album.id} className="group rounded-xl overflow-hidden border border-border cursor-pointer card-glow relative bg-card">
              <div className="aspect-video overflow-hidden bg-secondary relative">
                <img
                  src={
                    album.coverUrl
                      ? (album.coverUrl.startsWith('http') ? album.coverUrl : `http://localhost:3000${album.coverUrl}`)
                      : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&auto=format'
                  }
                  alt={album.name}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  onClick={(e) => handleDelete(album.id, e)}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-md text-white hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Xóa album"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="p-3">
                <p className="font-medium text-foreground">{album.name}</p>
                {album.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{album.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal.isOpen} onClose={modal.close} title="Tạo album mới">
        <div className="space-y-4">
          <Input label="Tên album" placeholder="Nhập tên album..." value={formName} onChange={(e) => setFormName(e.target.value)} />
          <Input label="Mô tả" placeholder="Nhập mô tả album..." value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" onClick={modal.close} fullWidth>{t('common.cancel')}</Button>
            <Button fullWidth onClick={handleSave} loading={createMutation.isPending}>{t('common.save')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
