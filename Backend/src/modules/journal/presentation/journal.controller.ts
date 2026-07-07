import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/types/authenticated-user.type';
import { JournalService } from '../application/journal.service';
import { CreateJournalEntryDto, JournalQueryDto, UpdateJournalEntryDto } from './dto/journal.dto';
@ApiTags('journal')
@ApiBearerAuth('access-token')
@Controller('journal')
export class JournalController {
  constructor(private readonly journal: JournalService) {}
  @Get('entries') list(@CurrentUser() u: AuthenticatedUser, @Query() q: JournalQueryDto) {
    return this.journal.list(u.id, q);
  }
  @Post('entries') create(@CurrentUser() u: AuthenticatedUser, @Body() d: CreateJournalEntryDto) {
    return this.journal.create(u.id, d);
  }
  @Get('entries/:id') get(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.journal.get(u.id, id);
  }
  @Patch('entries/:id') update(
    @CurrentUser() u: AuthenticatedUser,
    @Param('id') id: string,
    @Body() d: UpdateJournalEntryDto,
  ) {
    return this.journal.update(u.id, id, d);
  }
  @Delete('entries/:id') remove(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.journal.remove(u.id, id);
  }
  @Get('moods/statistics') stats(@CurrentUser() u: AuthenticatedUser) {
    return this.journal.moodStatistics(u.id);
  }
}
