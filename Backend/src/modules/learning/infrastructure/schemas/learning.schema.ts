import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { FlashcardStatus, LearningLanguage, LearningSkill, StudyPlanStatus } from '../../domain/enums/learning.enum';
export type VocabularyDocument = HydratedDocument<Vocabulary>;
@Schema({ timestamps: true, collection: 'learning_vocabulary' })
export class Vocabulary {
  @Prop({ type: Types.ObjectId, required: true, index: true }) userId: Types.ObjectId;
  @Prop({ enum: LearningLanguage, required: true, index: true }) language: LearningLanguage;
  @Prop({ required: true, index: true }) word: string;
  @Prop({ required: true }) meaning: string;
  @Prop() pronunciation?: string;
  @Prop() example?: string;
  @Prop() note?: string;
  @Prop({ type: [String], default: [] }) tags: string[];
  @Prop() level?: string;
  @Prop({ default: false }) mastered: boolean;
}
export const VocabularySchema = SchemaFactory.createForClass(Vocabulary);
VocabularySchema.index({ userId: 1, language: 1, word: 1 });
export type FlashcardDocument = HydratedDocument<Flashcard>;
@Schema({ timestamps: true, collection: 'learning_flashcards' })
export class Flashcard {
  @Prop({ type: Types.ObjectId, required: true, index: true }) userId: Types.ObjectId;
  @Prop({ enum: LearningLanguage, required: true, index: true }) language: LearningLanguage;
  @Prop({ required: true }) front: string;
  @Prop({ required: true }) back: string;
  @Prop({ enum: FlashcardStatus, default: FlashcardStatus.NEW, index: true }) status: FlashcardStatus;
  @Prop() nextReviewAt?: Date;
}
export const FlashcardSchema = SchemaFactory.createForClass(Flashcard);
FlashcardSchema.index({ userId: 1, status: 1, nextReviewAt: 1 });
export type MockTestDocument = HydratedDocument<MockTest>;
@Schema({ timestamps: true, collection: 'learning_mock_tests' })
export class MockTest {
  @Prop({ type: Types.ObjectId, required: true, index: true }) userId: Types.ObjectId;
  @Prop({ enum: LearningLanguage, required: true, index: true }) language: LearningLanguage;
  @Prop({ required: true }) testName: string;
  @Prop({ required: true, index: true }) testDate: Date;
  @Prop() listeningScore?: number;
  @Prop() readingScore?: number;
  @Prop() writingScore?: number;
  @Prop() speakingScore?: number;
  @Prop() totalScore?: number;
  @Prop() note?: string;
}
export const MockTestSchema = SchemaFactory.createForClass(MockTest);
export type StudyPlanDocument = HydratedDocument<StudyPlan>;
@Schema({ timestamps: true, collection: 'learning_study_plans' })
export class StudyPlan {
  @Prop({ type: Types.ObjectId, required: true, index: true }) userId: Types.ObjectId;
  @Prop({ enum: LearningLanguage, required: true, index: true }) language: LearningLanguage;
  @Prop({ required: true }) title: string;
  @Prop() description?: string;
  @Prop({ required: true }) startDate: Date;
  @Prop({ required: true }) endDate: Date;
  @Prop() targetScore?: string;
  @Prop({ default: 30 }) dailyMinutes: number;
  @Prop({ enum: StudyPlanStatus, default: StudyPlanStatus.PLANNED, index: true }) status: StudyPlanStatus;
}
export const StudyPlanSchema = SchemaFactory.createForClass(StudyPlan);
export type StudyLogDocument = HydratedDocument<StudyLog>;
@Schema({ timestamps: true, collection: 'learning_study_logs' })
export class StudyLog {
  @Prop({ type: Types.ObjectId, required: true, index: true }) userId: Types.ObjectId;
  @Prop({ enum: LearningLanguage, required: true, index: true }) language: LearningLanguage;
  @Prop({ enum: LearningSkill, required: true, index: true }) skill: LearningSkill;
  @Prop({ required: true, min: 1 }) minutes: number;
  @Prop({ required: true, index: true }) studiedAt: Date;
  @Prop() note?: string;
}
export const StudyLogSchema = SchemaFactory.createForClass(StudyLog);
StudyLogSchema.index({ userId: 1, studiedAt: -1 });
export type GrammarNoteDocument = HydratedDocument<GrammarNote>;
@Schema({ timestamps: true, collection: 'learning_grammar_notes' })
export class GrammarNote {
  @Prop({ type: Types.ObjectId, required: true, index: true }) userId: Types.ObjectId;
  @Prop({ enum: LearningLanguage, required: true, index: true }) language: LearningLanguage;
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) content: string;
  @Prop({ type: [String], default: [] }) tags: string[];
}
export const GrammarNoteSchema = SchemaFactory.createForClass(GrammarNote);
