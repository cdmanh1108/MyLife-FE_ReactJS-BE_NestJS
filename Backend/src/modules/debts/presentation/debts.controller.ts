import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/types/authenticated-user.type';
import { DebtsService } from '../application/debts.service';
import {
  CreateDebtPersonDto,
  CreateDebtRecordDto,
  DebtRecordQueryDto,
  UpdateDebtPersonDto,
  UpdateDebtRecordDto,
} from './dto/debts.dto';
@ApiTags('debts')
@ApiBearerAuth('access-token')
@Controller('debts')
export class DebtsController {
  constructor(private readonly debts: DebtsService) {}
  @Get('people') listPeople(@CurrentUser() u: AuthenticatedUser) {
    return this.debts.listPeople(u.id);
  }
  @Post('people') createPerson(@CurrentUser() u: AuthenticatedUser, @Body() dto: CreateDebtPersonDto) {
    return this.debts.createPerson(u.id, dto);
  }
  @Get('people/:id') getPerson(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.debts.getPerson(u.id, id);
  }
  @Patch('people/:id') updatePerson(
    @CurrentUser() u: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateDebtPersonDto,
  ) {
    return this.debts.updatePerson(u.id, id, dto);
  }
  @Delete('people/:id') deletePerson(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.debts.deletePerson(u.id, id);
  }
  @Get('records') @ApiOperation({ summary: 'List debt records' }) listRecords(
    @CurrentUser() u: AuthenticatedUser,
    @Query() q: DebtRecordQueryDto,
  ) {
    return this.debts.listRecords(u.id, q);
  }
  @Post('records') createRecord(@CurrentUser() u: AuthenticatedUser, @Body() dto: CreateDebtRecordDto) {
    return this.debts.createRecord(u.id, dto);
  }
  @Get('records/:id') getRecord(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.debts.getRecord(u.id, id);
  }
  @Patch('records/:id') updateRecord(
    @CurrentUser() u: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateDebtRecordDto,
  ) {
    return this.debts.updateRecord(u.id, id, dto);
  }
  @Delete('records/:id') deleteRecord(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.debts.deleteRecord(u.id, id);
  }
  @Post('records/:id/settle') settle(@CurrentUser() u: AuthenticatedUser, @Param('id') id: string) {
    return this.debts.settleRecord(u.id, id);
  }
  @Post('records/bulk-settle') bulk(@CurrentUser() u: AuthenticatedUser) {
    return this.debts.bulkSettle(u.id);
  }
  @Get('summary') summary(@CurrentUser() u: AuthenticatedUser) {
    return this.debts.summary(u.id);
  }
  @Post('settlements/calculate') calculate(@CurrentUser() u: AuthenticatedUser) {
    return this.debts.calculate(u.id);
  }
}
