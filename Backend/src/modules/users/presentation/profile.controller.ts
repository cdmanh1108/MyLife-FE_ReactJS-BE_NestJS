import { Body, Controller, Get, Patch, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/types/authenticated-user.type';
import { UsersService } from '../application/users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { BiographyDto } from './dto/biography.dto';

@ApiTags('profile')
@ApiBearerAuth('access-token')
@Controller('profile')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current profile' })
  @ApiOkResponse({ type: UserResponseDto })
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.toResponse(await this.usersService.requireById(user.id));
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current profile' })
  @ApiOkResponse({ type: UserResponseDto })
  async updateMe(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Get('biography')
  @ApiOperation({ summary: 'Get owner biography' })
  @ApiOkResponse({ type: BiographyDto })
  async getBiography(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getBiography(user.id);
  }

  @Put('biography')
  @ApiOperation({ summary: 'Update owner biography' })
  @ApiOkResponse({ type: BiographyDto })
  async updateBiography(@CurrentUser() user: AuthenticatedUser, @Body() dto: BiographyDto) {
    return this.usersService.updateBiography(user.id, dto.content);
  }
}
