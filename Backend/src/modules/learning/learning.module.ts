import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Flashcard,
  FlashcardSchema,
  GrammarNote,
  GrammarNoteSchema,
  MockTest,
  MockTestSchema,
  StudyLog,
  StudyLogSchema,
  StudyPlan,
  StudyPlanSchema,
  Vocabulary,
  VocabularySchema,
} from './infrastructure/schemas/learning.schema';
import { LearningController } from './presentation/learning.controller';
import { LearningService } from './application/learning.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vocabulary.name, schema: VocabularySchema },
      { name: Flashcard.name, schema: FlashcardSchema },
      { name: MockTest.name, schema: MockTestSchema },
      { name: StudyPlan.name, schema: StudyPlanSchema },
      { name: StudyLog.name, schema: StudyLogSchema },
      { name: GrammarNote.name, schema: GrammarNoteSchema },
    ]),
  ],
  providers: [LearningService],
  controllers: [LearningController],
  exports: [LearningService],
})
export class LearningModule {}
