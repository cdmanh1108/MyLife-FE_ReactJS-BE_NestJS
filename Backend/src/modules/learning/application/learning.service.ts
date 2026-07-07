import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { paginated, skipOf } from '../../../common/utils/pagination.util';
import {
  Flashcard,
  FlashcardDocument,
  MockTest,
  MockTestDocument,
  StudyLog,
  StudyLogDocument,
  StudyPlan,
  StudyPlanDocument,
  Vocabulary,
  VocabularyDocument,
} from '../infrastructure/schemas/learning.schema';
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
} from '../presentation/dto/learning.dto';
@Injectable()
export class LearningService {
  constructor(
    @InjectModel(Vocabulary.name) private readonly vocab: Model<VocabularyDocument>,
    @InjectModel(Flashcard.name) private readonly cards: Model<FlashcardDocument>,
    @InjectModel(MockTest.name) private readonly tests: Model<MockTestDocument>,
    @InjectModel(StudyPlan.name) private readonly plans: Model<StudyPlanDocument>,
    @InjectModel(StudyLog.name) private readonly logs: Model<StudyLogDocument>,
  ) {}
  async listVocabulary(userId: string, q: LearningQueryDto) {
    return this.paginate(this.vocab, userId, q, 'word');
  }
  createVocabulary(userId: string, d: CreateVocabularyDto) {
    return this.vocab.create({ ...d, userId: new Types.ObjectId(userId), tags: d.tags ?? [] });
  }
  async updateVocabulary(userId: string, id: string, d: UpdateVocabularyDto) {
    return this.updateOne(this.vocab, userId, id, { ...d }, 'VOCABULARY_NOT_FOUND');
  }
  async removeVocabulary(userId: string, id: string) {
    await this.vocab.deleteOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) });
    return { deleted: true };
  }
  async listFlashcards(userId: string, q: LearningQueryDto) {
    return this.paginate(this.cards, userId, q, 'front');
  }
  createFlashcard(userId: string, d: CreateFlashcardDto) {
    return this.cards.create({ ...d, userId: new Types.ObjectId(userId) });
  }
  async updateFlashcard(userId: string, id: string, d: UpdateFlashcardDto) {
    return this.updateOne(
      this.cards,
      userId,
      id,
      { ...d, nextReviewAt: d.nextReviewAt ? new Date(d.nextReviewAt) : undefined },
      'FLASHCARD_NOT_FOUND',
    );
  }
  reviewFlashcard(userId: string, id: string, d: ReviewFlashcardDto) {
    return this.updateFlashcard(userId, id, d);
  }
  async removeFlashcard(userId: string, id: string) {
    await this.cards.deleteOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) });
    return { deleted: true };
  }
  async listMockTests(userId: string, q: LearningQueryDto) {
    return this.paginate(this.tests, userId, q, 'testName');
  }
  createMockTest(userId: string, d: CreateMockTestDto) {
    return this.tests.create({ ...d, userId: new Types.ObjectId(userId), testDate: new Date(d.testDate) });
  }
  async updateMockTest(userId: string, id: string, d: UpdateMockTestDto) {
    return this.updateOne(
      this.tests,
      userId,
      id,
      { ...d, testDate: d.testDate ? new Date(d.testDate) : undefined },
      'MOCK_TEST_NOT_FOUND',
    );
  }
  async removeMockTest(userId: string, id: string) {
    await this.tests.deleteOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) });
    return { deleted: true };
  }
  async listStudyPlans(userId: string, q: LearningQueryDto) {
    return this.paginate(this.plans, userId, q, 'title');
  }
  createStudyPlan(userId: string, d: CreateStudyPlanDto) {
    return this.plans.create({
      ...d,
      userId: new Types.ObjectId(userId),
      startDate: new Date(d.startDate),
      endDate: new Date(d.endDate),
    });
  }
  async updateStudyPlan(userId: string, id: string, d: UpdateStudyPlanDto) {
    return this.updateOne(
      this.plans,
      userId,
      id,
      {
        ...d,
        startDate: d.startDate ? new Date(d.startDate) : undefined,
        endDate: d.endDate ? new Date(d.endDate) : undefined,
      },
      'STUDY_PLAN_NOT_FOUND',
    );
  }
  async removeStudyPlan(userId: string, id: string) {
    await this.plans.deleteOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) });
    return { deleted: true };
  }
  async listStudyLogs(userId: string, q: LearningQueryDto) {
    return this.paginate(this.logs, userId, q, 'note');
  }
  createStudyLog(userId: string, d: CreateStudyLogDto) {
    return this.logs.create({ ...d, userId: new Types.ObjectId(userId), studiedAt: new Date(d.studiedAt) });
  }
  async statistics(userId: string) {
    const totalMinutes = await this.logs.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          total: { $sum: '$minutes' },
          days: { $addToSet: { $dateToString: { format: '%Y-%m-%d', date: '$studiedAt' } } },
        },
      },
    ]);
    return { totalMinutes: totalMinutes[0]?.total ?? 0, learningStreak: totalMinutes[0]?.days?.length ?? 0 };
  }
  private async paginate(model: any, userId: string, q: LearningQueryDto, keywordField: string) {
    const f: Record<string, unknown> = { userId: new Types.ObjectId(userId) };
    if (q.language) f.language = q.language;
    if (q.keyword) f[keywordField] = { $regex: q.keyword, $options: 'i' };
    const [items, total] = await Promise.all([
      model.find(f).sort({ createdAt: -1 }).skip(skipOf(q.page, q.limit)).limit(q.limit),
      model.countDocuments(f),
    ]);
    return paginated(items, q.page, q.limit, total);
  }
  private async updateOne(model: any, userId: string, id: string, update: Record<string, unknown>, code: string) {
    Object.keys(update).forEach((k) => update[k] === undefined && delete update[k]);
    const d = await model.findOneAndUpdate(
      { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
      update,
      { new: true },
    );
    if (!d) throw new NotFoundException({ code, message: code });
    return d;
  }
}
