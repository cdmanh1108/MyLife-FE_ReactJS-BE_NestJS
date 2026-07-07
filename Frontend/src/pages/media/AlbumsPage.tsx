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
import { ConfirmModal } from '@/shared/ui/ConfirmModal';

export default function AlbumsPage() {
  const { t } = useTranslation();
  const modal = useDisclosure();
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: albums = [], isLoading, isError, refetch } = useAlbums();
  const createMutation = useCreateAlbum();
  const deleteMutation = useDeleteAlbum();

  const handleSave = () => {
    if (!formName.trim()) {
      toast.error(t('media.toastEnterAlbumName'));
      return;
    }
    createMutation.mutate(
      { name: formName.trim(), description: formDescription.trim() || undefined },
      {
        onSuccess: () => {
          toast.success(t('media.toastAlbumCreated'));
          modal.close();
          setFormName('');
          setFormDescription('');
        },
        onError: () => toast.error(t('media.toastAlbumCreateError')),
      }
    );
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={t('media.errorLoadAlbums')} onRetry={refetch} />;

  return (
    <div className="space-y-5 animate-slide-up">
      <PageHeader
        title={t('nav.albums')}
        actions={<Button size="sm" onClick={modal.open}><Plus size={14} />{t('media.createAlbum')}</Button>}
      />

      {albums.length === 0 ? (
        <EmptyState
          icon={<FolderOpen size={24} />}
          title={t('media.noAlbums')}
          action={<Button size="sm" onClick={modal.open}><Plus size={14} />{t('media.createFirstAlbum')}</Button>}
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
                  title={t('media.deleteAlbum')}
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

      <Modal open={modal.isOpen} onClose={modal.close} title={t('media.createAlbumTitle')}>
        <div className="space-y-4">
          <Input label={t('media.albumName')} placeholder={t('media.albumNamePlaceholder')} value={formName} onChange={(e) => setFormName(e.target.value)} />
          <Input label={t('media.albumDescription')} placeholder={t('media.albumDescriptionPlaceholder')} value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" onClick={modal.close} fullWidth>{t('common.cancel')}</Button>
            <Button fullWidth onClick={handleSave} loading={createMutation.isPending}>{t('common.save')}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteMutation.mutate(deleteId, {
              onSuccess: () => {
                toast.success(t('media.toastAlbumDeleted'));
                setDeleteId(null);
              },
              onError: () => toast.error(t('media.toastAlbumDeleteError')),
            });
          }
        }}
        title={t('media.deleteAlbumTitle')}
        description={t('confirmations.deleteAlbum')}
        variant="danger"
        confirmText={t('common.delete')}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
