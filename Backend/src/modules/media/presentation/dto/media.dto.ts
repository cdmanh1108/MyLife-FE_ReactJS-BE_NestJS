import { ApiProperty, ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../../common/dto/pagination.dto';
import { MediaType } from '../../domain/enums/media.enum';
export class MediaQueryDto extends IntersectionType(PaginationQueryDto) {
  @ApiPropertyOptional({ enum: MediaType }) @IsOptional() @IsEnum(MediaType) type?: MediaType;
  @ApiPropertyOptional() @IsOptional() @IsMongoId() albumId?: string;
}
export class UploadMediaDto {
  @ApiPropertyOptional() @IsOptional() @IsMongoId() albumId?: string;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @ApiPropertyOptional() @IsOptional() @IsDateString() takenAt?: string;
}
export class CreateAlbumDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsMongoId() coverAssetId?: string;
}
export class UpdateAlbumDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsMongoId() coverAssetId?: string;
}
