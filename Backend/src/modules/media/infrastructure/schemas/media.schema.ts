import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MediaType, MediaVisibility } from '../../domain/enums/media.enum';
export type MediaAssetDocument = HydratedDocument<MediaAsset>;
@Schema({ timestamps: true, collection: 'media_assets' })
export class MediaAsset {
  @Prop({ type: Types.ObjectId, required: true, index: true }) userId: Types.ObjectId;
  @Prop({ enum: MediaType, required: true, index: true }) type: MediaType;
  @Prop({ required: true }) filename: string;
  @Prop({ required: true }) originalName: string;
  @Prop({ required: true }) mimeType: string;
  @Prop({ required: true }) size: number;
  @Prop({ required: true }) url: string;
  @Prop({ required: true }) storageKey: string;
  @Prop({ type: Types.ObjectId, index: true }) albumId?: Types.ObjectId;
  @Prop({ type: [String], default: [] }) tags: string[];
  @Prop() takenAt?: Date;
  @Prop({ enum: MediaVisibility, default: MediaVisibility.PRIVATE }) visibility: MediaVisibility;
}
export const MediaAssetSchema = SchemaFactory.createForClass(MediaAsset);
MediaAssetSchema.index({ userId: 1, createdAt: -1 });
export type AlbumDocument = HydratedDocument<Album>;
@Schema({ timestamps: true, collection: 'media_albums' })
export class Album {
  @Prop({ type: Types.ObjectId, required: true, index: true }) userId: Types.ObjectId;
  @Prop({ required: true }) title: string;
  @Prop() description?: string;
  @Prop({ type: Types.ObjectId }) coverAssetId?: Types.ObjectId;
}
export const AlbumSchema = SchemaFactory.createForClass(Album);
AlbumSchema.index({ userId: 1, title: 1 });
