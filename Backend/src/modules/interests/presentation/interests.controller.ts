import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/types/authenticated-user.type';
import { InterestsService } from '../application/interests.service';
import { CreateInterestDto, InterestQueryDto, UpdateInterestDto } from './dto/interests.dto';
@ApiTags('interests')
@ApiBearerAuth('access-token')
@Controller('interests')
export class InterestsController {
  constructor(private readonly interests: InterestsService) {}
  @Get() list(@CurrentUser() u: AuthenticatedUser, @Query() q: InterestQueryDto) {
    return this.interests.list(u.id, q);
  }
  @Post() create(@CurrentUser() u: AuthenticatedUser, @Body() d: CreateInterestDto) {
    return this.interests.create(u.id, d);
  }
  @Get(':id') get(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.interests.get(u.id, id);
  }
  @Patch(':id') update(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string, @Body() d: UpdateInterestDto) {
    return this.interests.update(u.id, id, d);
  }
  @Delete(':id') remove(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.interests.remove(u.id, id);
  }
}
