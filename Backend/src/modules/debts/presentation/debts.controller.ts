import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/types/authenticated-user.type';
import { DebtsService } from '../application/debts.service';
import {
  CreateDebtPersonDto,
  CreateDebtRecordDto,
  DebtRecordQueryDto,
  UpdateDebtPersonDto,
  UpdateDebtRecordDto,
  DebtPersonResponseDto,
  DebtRecordResponseDto,
  SettlementResponseDto,
} from './dto/debts.dto';
@ApiTags('debts')
@ApiBearerAuth('access-token')
@Controller('debts')
export class DebtsController {
  constructor(private readonly debts: DebtsService) {}
  
  @Get('people')
  @ApiOkResponse({ type: [DebtPersonResponseDto] })
  listPeople(@CurrentUser() u: AuthenticatedUser) {
    return this.debts.listPeople(u.id);
  }

  @Post('people')
  @ApiCreatedResponse({ type: DebtPersonResponseDto })
  createPerson(@CurrentUser() u: AuthenticatedUser, @Body() dto: CreateDebtPersonDto) {
    return this.debts.createPerson(u.id, dto);
  }

  @Get('people/:id')
  @ApiOkResponse({ type: DebtPersonResponseDto })
  getPerson(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.debts.getPerson(u.id, id);
  }

  @Patch('people/:id')
  @ApiOkResponse({ type: DebtPersonResponseDto })
  updatePerson(
    @CurrentUser() u: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateDebtPersonDto,
  ) {
    return this.debts.updatePerson(u.id, id, dto);
  }
  @Delete('people/:id') deletePerson(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.debts.deletePerson(u.id, id);
  }
  @Get('records')
  @ApiOperation({ summary: 'List debt records' })
  @ApiOkResponse({ type: [DebtRecordResponseDto] })
  listRecords(
    @CurrentUser() u: AuthenticatedUser,
    @Query() q: DebtRecordQueryDto,
  ) {
    return this.debts.listRecords(u.id, q);
  }

  @Post('records')
  @ApiCreatedResponse({ type: DebtRecordResponseDto })
  createRecord(@CurrentUser() u: AuthenticatedUser, @Body() dto: CreateDebtRecordDto) {
    return this.debts.createRecord(u.id, dto);
  }

  @Get('records/:id')
  @ApiOkResponse({ type: DebtRecordResponseDto })
  getRecord(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.debts.getRecord(u.id, id);
  }

  @Patch('records/:id')
  @ApiOkResponse({ type: DebtRecordResponseDto })
  updateRecord(
    @CurrentUser() u: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateDebtRecordDto,
  ) {
    return this.debts.updateRecord(u.id, id, dto);
  }

  @Delete('records/:id')
  deleteRecord(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.debts.deleteRecord(u.id, id);
  }

  @Post('records/:id/settle')
  @ApiOkResponse({ type: DebtRecordResponseDto })
  settle(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.debts.settleRecord(u.id, id);
  }
  @Post('records/bulk-settle') bulk(@CurrentUser() u: AuthenticatedUser) {
    return this.debts.bulkSettle(u.id);
  }
  @Get('summary')
  @ApiOkResponse({ type: SettlementResponseDto })
  summary(@CurrentUser() u: AuthenticatedUser) {
    return this.debts.summary(u.id);
  }

  @Post('settlements/calculate')
  @ApiOkResponse({ type: SettlementResponseDto })
  calculate(@CurrentUser() u: AuthenticatedUser) {
    return this.debts.calculate(u.id);
  }
}
