import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/types/authenticated-user.type';
import { TimelineService } from '../application/timeline.service';
import { CreateTimelineEventDto, TimelineQueryDto, UpdateTimelineEventDto } from './dto/timeline.dto';
@ApiTags('timeline')
@ApiBearerAuth('access-token')
@Controller('timeline/events')
export class TimelineController {
  constructor(private readonly timeline: TimelineService) {}
  @Get() list(@CurrentUser() u: AuthenticatedUser, @Query() q: TimelineQueryDto) {
    return this.timeline.list(u.id, q);
  }
  @Post() create(@CurrentUser() u: AuthenticatedUser, @Body() d: CreateTimelineEventDto) {
    return this.timeline.create(u.id, d);
  }
  @Get(':id') get(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.timeline.get(u.id, id);
  }
  @Patch(':id') update(
    @CurrentUser() u: AuthenticatedUser,
    @Param('id') id: string,
    @Body() d: UpdateTimelineEventDto,
  ) {
    return this.timeline.update(u.id, id, d);
  }
  @Delete(':id') remove(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.timeline.remove(u.id, id);
  }
}
