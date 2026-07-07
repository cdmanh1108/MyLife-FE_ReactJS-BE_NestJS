import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../common/types/authenticated-user.type';
import { FinanceService } from '../application/finance.service';
import {
  CreateBudgetDto,
  CreateCategoryDto,
  CreateTransactionDto,
  TransactionQueryDto,
  UpdateBudgetDto,
  UpdateCategoryDto,
  UpdateTransactionDto,
} from './dto/finance.dto';

@ApiTags('finance')
@ApiBearerAuth('access-token')
@Controller('finance')
export class FinanceController {
  constructor(private readonly finance: FinanceService) {}

  @Get('transactions')
  @ApiOperation({ summary: 'List finance transactions' })
  listTransactions(@CurrentUser() user: AuthenticatedUser, @Query() query: TransactionQueryDto) {
    return this.finance.listTransactions(user.id, query);
  }
  @Post('transactions')
  @ApiOperation({ summary: 'Create transaction' })
  createTransaction(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateTransactionDto) {
    return this.finance.createTransaction(user.id, dto);
  }
  @Get('transactions/:id')
  @ApiOperation({ summary: 'Get transaction detail' })
  getTransaction(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.finance.getTransaction(user.id, id);
  }
  @Patch('transactions/:id')
  @ApiOperation({ summary: 'Update transaction' })
  updateTransaction(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.finance.updateTransaction(user.id, id, dto);
  }
  @Delete('transactions/:id')
  @ApiOperation({ summary: 'Delete transaction' })
  deleteTransaction(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.finance.deleteTransaction(user.id, id);
  }

  @Get('categories') listCategories(@CurrentUser() user: AuthenticatedUser) {
    return this.finance.listCategories(user.id);
  }
  @Post('categories') createCategory(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateCategoryDto) {
    return this.finance.createCategory(user.id, dto);
  }
  @Patch('categories/:id') updateCategory(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.finance.updateCategory(user.id, id, dto);
  }
  @Delete('categories/:id') deleteCategory(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.finance.deleteCategory(user.id, id);
  }

  @Get('budgets') listBudgets(@CurrentUser() user: AuthenticatedUser) {
    return this.finance.listBudgets(user.id);
  }
  @Post('budgets') createBudget(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateBudgetDto) {
    return this.finance.createBudget(user.id, dto);
  }
  @Patch('budgets/:id') updateBudget(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateBudgetDto,
  ) {
    return this.finance.updateBudget(user.id, id, dto);
  }
  @Delete('budgets/:id') deleteBudget(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.finance.deleteBudget(user.id, id);
  }

  @Get('statistics/monthly') monthly(@CurrentUser() user: AuthenticatedUser) {
    return this.finance.monthlyStatistics(user.id);
  }
  @Get('statistics/categories') categories(@CurrentUser() user: AuthenticatedUser) {
    return this.finance.categoryStatistics(user.id);
  }
}
