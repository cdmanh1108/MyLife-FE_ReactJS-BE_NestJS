import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageModule } from '../../infrastructure/storage/storage.module';
import { Album, AlbumSchema, MediaAsset, MediaAssetSchema } from './infrastructure/schemas/media.schema';
import { MediaService } from './application/media.service';
import { MediaController } from './presentation/media.controller';
@Module({
  imports: [
    StorageModule,
    MongooseModule.forFeature([
      { name: MediaAsset.name, schema: MediaAssetSchema },
      { name: Album.name, schema: AlbumSchema },
    ]),
  ],
  providers: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
