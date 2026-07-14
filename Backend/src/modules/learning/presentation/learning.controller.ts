import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/types/authenticated-user.type';
import { LearningService } from '../application/learning.service';
import {
  CreateFlashcardDto,
  CreateMockTestDto,
  CreateStudyLogDto,
  CreateStudyPlanDto,
  CreateVocabularyDto,
  LearningQueryDto,
  ReviewFlashcardDto,
  UpdateFlashcardDto,
  UpdateMockTestDto,
  UpdateStudyPlanDto,
  UpdateVocabularyDto,
  VocabularyResponseDto,
  FlashcardResponseDto,
  MockTestResponseDto,
  StudyPlanResponseDto,
  StudyLogResponseDto,
  LearningStatisticsResponseDto,
} from './dto/learning.dto';
@ApiTags('learning')
@ApiBearerAuth('access-token')
@Controller('learning')
export class LearningController {
  constructor(private readonly learning: LearningService) {}

  @Get('vocabulary')
  @ApiOkResponse({ type: [VocabularyResponseDto] })
  listV(@CurrentUser() u: AuthenticatedUser, @Query() q: LearningQueryDto) {
    return this.learning.listVocabulary(u.id, q);
  }

  @Post('vocabulary')
  @ApiCreatedResponse({ type: VocabularyResponseDto })
  createV(@CurrentUser() u: AuthenticatedUser, @Body() d: CreateVocabularyDto) {
    return this.learning.createVocabulary(u.id, d);
  }

  @Patch('vocabulary/:id')
  @ApiOkResponse({ type: VocabularyResponseDto })
  updateV(
    @CurrentUser() u: AuthenticatedUser,
    @Param('id') id: string,
    @Body() d: UpdateVocabularyDto,
  ) {
    return this.learning.updateVocabulary(u.id, id, d);
  }

  @Delete('vocabulary/:id')
  delV(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.learning.removeVocabulary(u.id, id);
  }

  @Get('flashcards')
  @ApiOkResponse({ type: [FlashcardResponseDto] })
  listF(@CurrentUser() u: AuthenticatedUser, @Query() q: LearningQueryDto) {
    return this.learning.listFlashcards(u.id, q);
  }

  @Post('flashcards')
  @ApiCreatedResponse({ type: FlashcardResponseDto })
  createF(@CurrentUser() u: AuthenticatedUser, @Body() d: CreateFlashcardDto) {
    return this.learning.createFlashcard(u.id, d);
  }

  @Patch('flashcards/:id')
  @ApiOkResponse({ type: FlashcardResponseDto })
  updateF(
    @CurrentUser() u: AuthenticatedUser,
    @Param('id') id: string,
    @Body() d: UpdateFlashcardDto,
  ) {
    return this.learning.updateFlashcard(u.id, id, d);
  }

  @Delete('flashcards/:id')
  delF(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.learning.removeFlashcard(u.id, id);
  }

  @Post('flashcards/:id/review')
  @ApiOkResponse({ type: FlashcardResponseDto })
  reviewF(
    @CurrentUser() u: AuthenticatedUser,
    @Param('id') id: string,
    @Body() d: ReviewFlashcardDto,
  ) {
    return this.learning.reviewFlashcard(u.id, id, d);
  }

  @Get('mock-tests')
  @ApiOkResponse({ type: [MockTestResponseDto] })
  listT(@CurrentUser() u: AuthenticatedUser, @Query() q: LearningQueryDto) {
    return this.learning.listMockTests(u.id, q);
  }

  @Post('mock-tests')
  @ApiCreatedResponse({ type: MockTestResponseDto })
  createT(@CurrentUser() u: AuthenticatedUser, @Body() d: CreateMockTestDto) {
    return this.learning.createMockTest(u.id, d);
  }

  @Patch('mock-tests/:id')
  @ApiOkResponse({ type: MockTestResponseDto })
  updateT(
    @CurrentUser() u: AuthenticatedUser,
    @Param('id') id: string,
    @Body() d: UpdateMockTestDto,
  ) {
    return this.learning.updateMockTest(u.id, id, d);
  }

  @Delete('mock-tests/:id')
  delT(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.learning.removeMockTest(u.id, id);
  }

  @Get('study-plans')
  @ApiOkResponse({ type: [StudyPlanResponseDto] })
  listP(@CurrentUser() u: AuthenticatedUser, @Query() q: LearningQueryDto) {
    return this.learning.listStudyPlans(u.id, q);
  }

  @Post('study-plans')
  @ApiCreatedResponse({ type: StudyPlanResponseDto })
  createP(@CurrentUser() u: AuthenticatedUser, @Body() d: CreateStudyPlanDto) {
    return this.learning.createStudyPlan(u.id, d);
  }

  @Patch('study-plans/:id')
  @ApiOkResponse({ type: StudyPlanResponseDto })
  updateP(
    @CurrentUser() u: AuthenticatedUser,
    @Param('id') id: string,
    @Body() d: UpdateStudyPlanDto,
  ) {
    return this.learning.updateStudyPlan(u.id, id, d);
  }

  @Delete('study-plans/:id')
  delP(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.learning.removeStudyPlan(u.id, id);
  }

  @Get('study-logs')
  @ApiOkResponse({ type: [StudyLogResponseDto] })
  listL(@CurrentUser() u: AuthenticatedUser, @Query() q: LearningQueryDto) {
    return this.learning.listStudyLogs(u.id, q);
  }

  @Post('study-logs')
  @ApiCreatedResponse({ type: StudyLogResponseDto })
  createL(@CurrentUser() u: AuthenticatedUser, @Body() d: CreateStudyLogDto) {
    return this.learning.createStudyLog(u.id, d);
  }

  @Get('statistics')
  @ApiOkResponse({ type: LearningStatisticsResponseDto })
  stats(@CurrentUser() u: AuthenticatedUser) {
    return this.learning.statistics(u.id);
  }
}
