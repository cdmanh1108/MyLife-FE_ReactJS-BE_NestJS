import mongoose from 'mongoose';

async function run() {
  const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/mylife_os';
  await mongoose.connect(uri);
  const db = mongoose.connection.db!;
  const collections = [
    'finance_transactions',
    'debt_records',
    'todos',
    'goals',
    'timeline_events',
    'journal_entries',
    'media_assets',
    'interests',
    'learning_vocabulary',
    'learning_study_logs',
  ];
  for (const collection of collections) {
    try {
      await db.collection(collection).dropIndexes();
      console.log(`Dropped non-_id indexes for ${collection}`);
    } catch (error) {
      console.warn(`Skip ${collection}: ${(error as Error).message}`);
    }
  }
  await mongoose.disconnect();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
