import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { paginated, skipOf } from '../../../common/utils/pagination.util';
import { startOfMonth, endOfMonth } from '../../../common/utils/date.util';
import { Transaction, TransactionDocument } from '../infrastructure/schemas/transaction.schema';
import { FinanceCategory, FinanceCategoryDocument } from '../infrastructure/schemas/category.schema';
import { Budget, BudgetDocument } from '../infrastructure/schemas/budget.schema';
import {
  CreateBudgetDto,
  CreateCategoryDto,
  CreateTransactionDto,
  TransactionQueryDto,
  UpdateBudgetDto,
  UpdateCategoryDto,
  UpdateTransactionDto,
} from '../presentation/dto/finance.dto';
import { TransactionType } from '../domain/enums/finance.enum';

@Injectable()
export class FinanceService {
  constructor(
    @InjectModel(Transaction.name) private readonly txModel: Model<TransactionDocument>,
    @InjectModel(FinanceCategory.name) private readonly categoryModel: Model<FinanceCategoryDocument>,
    @InjectModel(Budget.name) private readonly budgetModel: Model<BudgetDocument>,
  ) {}

  async listTransactions(userId: string, query: TransactionQueryDto) {
    const filter: Record<string, unknown> = { userId: new Types.ObjectId(userId) };
    if (query.type) filter.type = query.type;
    if (query.categoryId) filter.categoryId = new Types.ObjectId(query.categoryId);
    if (query.walletId) filter.walletId = new Types.ObjectId(query.walletId);
    if (query.fromDate || query.toDate) filter.occurredAt = this.dateFilter(query.fromDate, query.toDate);
    if (query.keyword) filter.note = { $regex: query.keyword, $options: 'i' };
    const [items, total] = await Promise.all([
      this.txModel
        .find(filter)
        .sort({ occurredAt: -1 })
        .skip(skipOf(query.page, query.limit))
        .limit(query.limit)
        .exec(),
      this.txModel.countDocuments(filter).exec(),
    ]);
    return paginated(
      items.map((doc) => this.toTransaction(doc)),
      query.page,
      query.limit,
      total,
    );
  }

  async createTransaction(userId: string, dto: CreateTransactionDto) {
    const doc = await this.txModel.create({
      ...dto,
      userId: new Types.ObjectId(userId),
      categoryId: dto.categoryId ? new Types.ObjectId(dto.categoryId) : undefined,
      walletId: dto.walletId ? new Types.ObjectId(dto.walletId) : undefined,
      occurredAt: new Date(dto.occurredAt),
    });
    return this.toTransaction(doc);
  }

  async getTransaction(userId: string, id: string) {
    const doc = await this.txModel.findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) }).exec();
    if (!doc) throw new NotFoundException({ code: 'TRANSACTION_NOT_FOUND', message: 'Transaction not found' });
    return this.toTransaction(doc);
  }

  async updateTransaction(userId: string, id: string, dto: UpdateTransactionDto) {
    const update: Record<string, unknown> = { ...dto };
    if (dto.occurredAt) update.occurredAt = new Date(dto.occurredAt);
    if (dto.categoryId) update.categoryId = new Types.ObjectId(dto.categoryId);
    if (dto.walletId) update.walletId = new Types.ObjectId(dto.walletId);
    const doc = await this.txModel
      .findOneAndUpdate({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) }, update, { new: true })
      .exec();
    if (!doc) throw new NotFoundException({ code: 'TRANSACTION_NOT_FOUND', message: 'Transaction not found' });
    return this.toTransaction(doc);
  }

  async deleteTransaction(userId: string, id: string) {
    const res = await this.txModel
      .deleteOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) })
      .exec();
    if (!res.deletedCount)
      throw new NotFoundException({ code: 'TRANSACTION_NOT_FOUND', message: 'Transaction not found' });
    return { deleted: true };
  }

  async listCategories(userId: string) {
    return this.categoryModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ type: 1, name: 1 })
      .exec();
  }
  async createCategory(userId: string, dto: CreateCategoryDto) {
    return this.categoryModel.create({ ...dto, userId: new Types.ObjectId(userId) });
  }
  async updateCategory(userId: string, id: string, dto: UpdateCategoryDto) {
    const doc = await this.categoryModel
      .findOneAndUpdate({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) }, dto, { new: true })
      .exec();
    if (!doc) throw new NotFoundException({ code: 'CATEGORY_NOT_FOUND', message: 'Category not found' });
    return doc;
  }
  async deleteCategory(userId: string, id: string) {
    await this.categoryModel.deleteOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) }).exec();
    return { deleted: true };
  }

  async listBudgets(userId: string) {
    return this.budgetModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ month: -1 })
      .exec();
  }
  async createBudget(userId: string, dto: CreateBudgetDto) {
    return this.budgetModel.create({
      ...dto,
      userId: new Types.ObjectId(userId),
      categoryId: dto.categoryId ? new Types.ObjectId(dto.categoryId) : undefined,
    });
  }
  async updateBudget(userId: string, id: string, dto: UpdateBudgetDto) {
    const update = { ...dto, categoryId: dto.categoryId ? new Types.ObjectId(dto.categoryId) : undefined };
    const doc = await this.budgetModel
      .findOneAndUpdate({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) }, update, { new: true })
      .exec();
    if (!doc) throw new NotFoundException({ code: 'BUDGET_NOT_FOUND', message: 'Budget not found' });
    return doc;
  }
  async deleteBudget(userId: string, id: string) {
    await this.budgetModel.deleteOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) }).exec();
    return { deleted: true };
  }

  async monthlyStatistics(userId: string) {
    const from = startOfMonth();
    const to = endOfMonth();
    return this.aggregateSummary(userId, from, to);
  }

  async categoryStatistics(userId: string) {
    return this.txModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId), type: TransactionType.EXPENSE } },
      { $group: { _id: '$categoryId', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);
  }

  async aggregateSummary(userId: string, from = startOfMonth(), to = endOfMonth()) {
    const rows = await this.txModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId), occurredAt: { $gte: from, $lte: to } } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]);
    const income = rows.find((r) => r._id === TransactionType.INCOME)?.total ?? 0;
    const expense = rows.find((r) => r._id === TransactionType.EXPENSE)?.total ?? 0;
    return { monthlyIncome: income, monthlyExpense: expense, balance: income - expense };
  }

  private dateFilter(from?: string, to?: string) {
    const filter: Record<string, Date> = {};
    if (from) filter.$gte = new Date(from);
    if (to) filter.$lte = new Date(to);
    return filter;
  }

  private toTransaction(doc: TransactionDocument) {
    return {
      id: doc._id.toString(),
      type: doc.type,
      amount: doc.amount,
      currency: doc.currency,
      categoryId: doc.categoryId?.toString(),
      walletId: doc.walletId?.toString(),
      note: doc.note,
      occurredAt: doc.occurredAt,
      createdAt: doc.get('createdAt'),
      updatedAt: doc.get('updatedAt'),
    };
  }
}
