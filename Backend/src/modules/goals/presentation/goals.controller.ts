import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/types/authenticated-user.type';
import { GoalsService } from '../application/goals.service';
import { CreateGoalDto, CreateMilestoneDto, GoalQueryDto, UpdateGoalDto, UpdateMilestoneDto, GoalResponseDto } from './dto/goals.dto';
@ApiTags('goals')
@ApiBearerAuth('access-token')
@Controller('goals')
export class GoalsController {
  constructor(private readonly goals: GoalsService) {}

  @Get()
  @ApiOkResponse({ type: [GoalResponseDto] })
  list(@CurrentUser() u: AuthenticatedUser, @Query() q: GoalQueryDto) {
    return this.goals.list(u.id, q);
  }

  @Post()
  @ApiCreatedResponse({ type: GoalResponseDto })
  create(@CurrentUser() u: AuthenticatedUser, @Body() d: CreateGoalDto) {
    return this.goals.create(u.id, d);
  }

  @Get(':id')
  @ApiOkResponse({ type: GoalResponseDto })
  get(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.goals.get(u.id, id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: GoalResponseDto })
  update(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string, @Body() d: UpdateGoalDto) {
    return this.goals.update(u.id, id, d);
  }

  @Delete(':id')
  remove(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.goals.remove(u.id, id);
  }

  @Post(':id/milestones')
  @ApiCreatedResponse({ type: GoalResponseDto })
  addM(
    @CurrentUser() u: AuthenticatedUser,
    @Param('id') id: string,
    @Body() d: CreateMilestoneDto,
  ) {
    return this.goals.addMilestone(u.id, id, d);
  }

  @Patch(':id/milestones/:mid')
  @ApiOkResponse({ type: GoalResponseDto })
  updM(
    @CurrentUser() u: AuthenticatedUser,
    @Param('id') id: string,
    @Param('mid') mid: string,
    @Body() d: UpdateMilestoneDto,
  ) {
    return this.goals.updateMilestone(u.id, id, mid, d);
  }

  @Delete(':id/milestones/:mid')
  @ApiOkResponse({ type: GoalResponseDto })
  delM(
    @CurrentUser() u: AuthenticatedUser,
    @Param('id') id: string,
    @Param('mid') mid: string,
  ) {
    return this.goals.removeMilestone(u.id, id, mid);
  }
}
