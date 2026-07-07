import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Music, Film, Gamepad2, BookOpen, Quote, Trash2, HelpCircle } from 'lucide-react';
import { PageHeader } from '@/shared/ui/PageHeader';
import { Button } from '@/shared/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { LoadingState } from '@/shared/ui/LoadingState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { useDisclosure } from '@/shared/hooks/useDisclosure';
import { useInterests, useCreateInterest, useDeleteInterest } from '@/features/interests/api/useInterests';
import { toast } from 'sonner';

type InterestType = 'MUSIC_GROUP' | 'SONG' | 'MOVIE' | 'ACTOR' | 'GAME' | 'BOOK' | 'QUOTE' | 'ANIME' | 'OTHER';

const CATEGORY_MAP: Record<string, { label: string; icon: React.ReactNode; types: InterestType[] }> = {
  music: {
    label: 'Âm nhạc',
    icon: <Music size={16} />,
    types: ['MUSIC_GROUP', 'SONG'],
  },
  movies: {
    label: 'Phim & Chương trình',
    icon: <Film size={16} />,
    types: ['MOVIE', 'ACTOR', 'ANIME'],
  },
  games: {
    label: 'Trò chơi',
    icon: <Gamepad2 size={16} />,
    types: ['GAME'],
  },
  books: {
    label: 'Sách',
    icon: <BookOpen size={16} />,
    types: ['BOOK'],
  },
  other: {
    label: 'Sở thích khác',
    icon: <HelpCircle size={16} />,
    types: ['OTHER'],
  },
};

export default function InterestsPage() {
  const { t } = useTranslation();
  const modal = useDisclosure();

  // Form states
  const [formType, setFormType] = useState<InterestType>('MUSIC_GROUP');
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formReason, setFormReason] = useState('');
  const [formRating, setFormRating] = useState('');

  const { data: interests = [], isLoading, isError, refetch } = useInterests();
  const createMutation = useCreateInterest();
  const deleteMutation = useDeleteInterest();

  const handleSave = () => {
    if (!formName.trim()) {
      toast.error('Vui lòng nhập tên sở thích');
      return;
    }
    const payload = {
      type: formType,
      name: formName.trim(),
      description: formDescription.trim() || undefined,
      reason: formReason.trim() || undefined,
      rating: formRating ? Number(formRating) : undefined,
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success('Đã thêm sở thích');
        modal.close();
        setFormName('');
        setFormDescription('');
        setFormReason('');
        setFormRating('');
      },
      onError: () => toast.error('Lỗi khi thêm sở thích'),
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa sở thích này?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success('Đã xóa thành công'),
        onError: () => toast.error('Lỗi khi xóa'),
      });
    }
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message="Lỗi khi tải danh sách sở thích" onRetry={refetch} />;

  // Filter quotes separately
  const quotesList = interests.filter((i) => i.type === 'QUOTE');
  
  // Filter others into groups
  const getItemsForCategory = (types: InterestType[]) => {
    return interests.filter((i) => types.includes(i.type));
  };

  return (
    <div className="space-y-5 animate-slide-up">
      <PageHeader
        title={t('interests.title')}
        actions={<Button size="sm" onClick={modal.open}><Plus size={14} />Thêm</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {Object.entries(CATEGORY_MAP).map(([key, category]) => {
          const items = getItemsForCategory(category.types);
          return (
            <Card key={key} className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">{category.icon}{category.label}</CardTitle>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Trống</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <Badge
                        key={item.id}
                        variant="muted"
                        className="flex items-center gap-1.5 py-1 px-2.5 group hover:border-destructive/40 transition-colors"
                      >
                        <span>{item.name}</span>
                        {item.rating && <span className="text-[10px] text-yellow-500 font-semibold font-mono">({item.rating}/10)</span>}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all ml-1 size-3.5 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Quote size={14} />Quotes yêu thích</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {quotesList.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Trống</p>
          ) : (
            quotesList.map((q) => (
              <blockquote key={q.id} className="relative border-l-2 border-primary/30 pl-3 group flex items-start justify-between">
                <div>
                  <p className="text-sm text-foreground italic">"{q.name}"</p>
                  {q.description && <p className="text-xs text-muted-foreground mt-1">— {q.description}</p>}
                </div>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity size-7 flex items-center justify-center rounded-md hover:bg-secondary/40"
                  title="Xóa quote"
                >
                  <Trash2 size={13} />
                </button>
              </blockquote>
            ))
          )}
        </CardContent>
      </Card>

      <Modal open={modal.isOpen} onClose={modal.close} title="Thêm sở thích / Trích dẫn">
        <div className="space-y-4">
          <Select
            label="Loại"
            options={[
              { value: 'MUSIC_GROUP', label: 'Nhóm nhạc / Ca sĩ' },
              { value: 'SONG', label: 'Bài hát' },
              { value: 'MOVIE', label: 'Phim điện ảnh / Truyền hình' },
              { value: 'ANIME', label: 'Anime / Phim hoạt hình' },
              { value: 'ACTOR', label: 'Diễn viên / Người nổi tiếng' },
              { value: 'GAME', label: 'Trò chơi điện tử' },
              { value: 'BOOK', label: 'Sách / Tác phẩm' },
              { value: 'QUOTE', label: 'Quotes / Câu nói hay' },
              { value: 'OTHER', label: 'Khác' },
            ]}
            value={formType}
            onChange={(e) => setFormType(e.target.value as InterestType)}
          />

          <Input
            label={formType === 'QUOTE' ? 'Câu trích dẫn' : 'Tên sở thích'}
            placeholder={formType === 'QUOTE' ? 'Nội dung câu nói...' : 'Tên tác phẩm, nghệ sĩ...'}
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />

          <Input
            label={formType === 'QUOTE' ? 'Tác giả / Nguồn' : 'Mô tả / Thể loại'}
            placeholder={formType === 'QUOTE' ? 'Tên tác giả...' : 'Mô tả ngắn gọn...'}
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          />

          {formType !== 'QUOTE' && (
            <>
              <Input
                label="Lý do yêu thích"
                placeholder="Tại sao bạn thích sở thích này..."
                value={formReason}
                onChange={(e) => setFormReason(e.target.value)}
              />
              <Input
                label="Đánh giá (0 - 10)"
                type="number"
                min="0"
                max="10"
                placeholder="Điểm số đánh giá..."
                value={formRating}
                onChange={(e) => setFormRating(e.target.value)}
              />
            </>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="ghost" onClick={modal.close} fullWidth>{t('common.cancel')}</Button>
            <Button fullWidth onClick={handleSave} loading={createMutation.isPending}>{t('common.save')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
