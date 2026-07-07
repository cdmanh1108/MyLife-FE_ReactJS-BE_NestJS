import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JournalEntry, JournalEntrySchema } from './infrastructure/schemas/journal-entry.schema';
import { JournalService } from './application/journal.service';
import { JournalController } from './presentation/journal.controller';
@Module({
  imports: [MongooseModule.forFeature([{ name: JournalEntry.name, schema: JournalEntrySchema }])],
  providers: [JournalService],
  controllers: [JournalController],
  exports: [JournalService],
})
export class JournalModule {}
