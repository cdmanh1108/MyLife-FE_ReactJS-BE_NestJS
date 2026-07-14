import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/types/authenticated-user.type';
import { TimelineService } from '../application/timeline.service';
import { CreateTimelineEventDto, TimelineQueryDto, UpdateTimelineEventDto, TimelineEventResponseDto } from './dto/timeline.dto';
@ApiTags('timeline')
@ApiBearerAuth('access-token')
@Controller('timeline/events')
export class TimelineController {
  constructor(private readonly timeline: TimelineService) {}

  @Get()
  @ApiOkResponse({ type: [TimelineEventResponseDto] })
  list(@CurrentUser() u: AuthenticatedUser, @Query() q: TimelineQueryDto) {
    return this.timeline.list(u.id, q);
  }

  @Post()
  @ApiCreatedResponse({ type: TimelineEventResponseDto })
  create(@CurrentUser() u: AuthenticatedUser, @Body() d: CreateTimelineEventDto) {
    return this.timeline.create(u.id, d);
  }

  @Get(':id')
  @ApiOkResponse({ type: TimelineEventResponseDto })
  get(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.timeline.get(u.id, id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: TimelineEventResponseDto })
  update(
    @CurrentUser() u: AuthenticatedUser,
    @Param('id') id: string,
    @Body() d: UpdateTimelineEventDto,
  ) {
    return this.timeline.update(u.id, id, d);
  }

  @Delete(':id')
  remove(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.timeline.remove(u.id, id);
  }
}
