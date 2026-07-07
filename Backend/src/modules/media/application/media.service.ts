import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { StorageService } from '../../../infrastructure/storage/storage.service';
import { paginated, skipOf } from '../../../common/utils/pagination.util';
import { MediaType } from '../domain/enums/media.enum';
import { Album, AlbumDocument, MediaAsset, MediaAssetDocument } from '../infrastructure/schemas/media.schema';
import { CreateAlbumDto, MediaQueryDto, UpdateAlbumDto, UploadMediaDto } from '../presentation/dto/media.dto';
@Injectable()
export class MediaService {
  constructor(
    @InjectModel(MediaAsset.name) private readonly assetModel: Model<MediaAssetDocument>,
    @InjectModel(Album.name) private readonly albumModel: Model<AlbumDocument>,
    private readonly storage: StorageService,
  ) {}
  async upload(userId: string, file: Express.Multer.File, dto: UploadMediaDto) {
    if (!file) throw new BadRequestException({ code: 'FILE_REQUIRED', message: 'File is required' });
    const type = this.resolveType(file.mimetype);
    const saved = await this.storage.saveLocal(file);
    return this.assetModel.create({
      ...saved,
      userId: new Types.ObjectId(userId),
      type,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      albumId: dto.albumId ? new Types.ObjectId(dto.albumId) : undefined,
      tags: dto.tags ?? [],
      takenAt: dto.takenAt ? new Date(dto.takenAt) : undefined,
    });
  }
  async list(userId: string, q: MediaQueryDto) {
    const f: Record<string, unknown> = { userId: new Types.ObjectId(userId) };
    if (q.type) f.type = q.type;
    if (q.albumId) f.albumId = new Types.ObjectId(q.albumId);
    const [items, total] = await Promise.all([
      this.assetModel.find(f).sort({ createdAt: -1 }).skip(skipOf(q.page, q.limit)).limit(q.limit),
      this.assetModel.countDocuments(f),
    ]);
    return paginated(items, q.page, q.limit, total);
  }
  async get(userId: string, id: string) {
    const d = await this.assetModel.findOne({ _id: id, userId });
    if (!d) throw new NotFoundException({ code: 'MEDIA_ASSET_NOT_FOUND', message: 'Media asset not found' });
    return d;
  }
  async remove(userId: string, id: string) {
    const d = await this.get(userId, id);
    await this.storage.deleteLocal(d.storageKey);
    await d.deleteOne();
    return { deleted: true };
  }
  listAlbums(userId: string) {
    return this.albumModel.find({ userId }).sort({ createdAt: -1 });
  }
  createAlbum(userId: string, d: CreateAlbumDto) {
    return this.albumModel.create({
      ...d,
      userId: new Types.ObjectId(userId),
      coverAssetId: d.coverAssetId ? new Types.ObjectId(d.coverAssetId) : undefined,
    });
  }
  async updateAlbum(userId: string, id: string, d: UpdateAlbumDto) {
    const u = { ...d, coverAssetId: d.coverAssetId ? new Types.ObjectId(d.coverAssetId) : undefined };
    const doc = await this.albumModel.findOneAndUpdate({ _id: id, userId }, u, { new: true });
    if (!doc) throw new NotFoundException({ code: 'ALBUM_NOT_FOUND', message: 'Album not found' });
    return doc;
  }
  async deleteAlbum(userId: string, id: string) {
    await this.albumModel.deleteOne({ _id: id, userId });
    return { deleted: true };
  }
  private resolveType(mime: string) {
    if (mime.startsWith('image/')) return MediaType.IMAGE;
    if (mime.startsWith('video/')) return MediaType.VIDEO;
    if (mime.startsWith('audio/')) return MediaType.AUDIO;
    return MediaType.DOCUMENT;
  }
}
