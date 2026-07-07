import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MoodType, JournalVisibility } from '../../domain/enums/journal.enum';
export type JournalEntryDocument = HydratedDocument<JournalEntry>;
@Schema({ timestamps: true, collection: 'journal_entries' })
export class JournalEntry {
  @Prop({ type: Types.ObjectId, required: true, index: true }) userId: Types.ObjectId;
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) content: string;
  @Prop({ enum: MoodType, default: MoodType.OTHER, index: true }) mood: MoodType;
  @Prop({ type: [String], default: [] }) tags: string[];
  @Prop({ type: [Types.ObjectId], default: [] }) mediaIds: Types.ObjectId[];
  @Prop({ enum: JournalVisibility, default: JournalVisibility.PRIVATE }) visibility: JournalVisibility;
  @Prop({ required: true, index: true }) writtenAt: Date;
}
export const JournalEntrySchema = SchemaFactory.createForClass(JournalEntry);
JournalEntrySchema.index({ userId: 1, writtenAt: -1 });
