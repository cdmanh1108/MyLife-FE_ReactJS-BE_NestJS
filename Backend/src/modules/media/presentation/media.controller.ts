import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/types/authenticated-user.type';
import { MediaService } from '../application/media.service';
import { CreateAlbumDto, MediaQueryDto, UpdateAlbumDto, UploadMediaDto, MediaAssetDto } from './dto/media.dto';
@ApiTags('media')
@ApiBearerAuth('access-token')
@Controller('media')
export class MediaController {
  constructor(private readonly media: MediaService) { }
  @Post('assets/upload')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 50 * 1024 * 1024 } }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        albumId: { type: 'string' },
        takenAt: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  upload(@CurrentUser() u: AuthenticatedUser, @UploadedFile() file: Express.Multer.File, @Body() dto: UploadMediaDto) {
    return this.media.upload(u.id, file, dto);
  }
  @Get('assets')
  @ApiOkResponse({ type: [MediaAssetDto] })
  list(@CurrentUser() u: AuthenticatedUser, @Query() q: MediaQueryDto) {
    return this.media.list(u.id, q);
  }
  @Get('assets/:id') get(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.media.get(u.id, id);
  }
  @Delete('assets/:id') remove(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.media.remove(u.id, id);
  }
  @Get('albums') albums(@CurrentUser() u: AuthenticatedUser) {
    return this.media.listAlbums(u.id);
  }
  @Post('albums') createAlbum(@CurrentUser() u: AuthenticatedUser, @Body() d: CreateAlbumDto) {
    return this.media.createAlbum(u.id, d);
  }
  @Patch('albums/:id') updateAlbum(
    @CurrentUser() u: AuthenticatedUser,
    @Param('id') id: string,
    @Body() d: UpdateAlbumDto,
  ) {
    return this.media.updateAlbum(u.id, id, d);
  }
  @Delete('albums/:id') deleteAlbum(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.media.deleteAlbum(u.id, id);
  }
}
