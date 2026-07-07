import mongoose from 'mongoose';

async function run() {
  const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/mylife_os';
  await mongoose.connect(uri);
  const db = mongoose.connection.db!;
  await Promise.all([
    db.collection('users').createIndex({ email: 1 }, { unique: true }),
    db.collection('finance_transactions').createIndex({ userId: 1, occurredAt: -1 }),
    db.collection('finance_transactions').createIndex({ userId: 1, type: 1, occurredAt: -1 }),
    db.collection('debt_people').createIndex({ userId: 1, name: 1 }),
    db.collection('debt_records').createIndex({ userId: 1, personId: 1, status: 1 }),
    db.collection('todos').createIndex({ userId: 1, dueDate: 1, status: 1 }),
    db.collection('goals').createIndex({ userId: 1, status: 1, targetDate: 1 }),
    db.collection('timeline_events').createIndex({ userId: 1, eventDate: -1 }),
    db.collection('journal_entries').createIndex({ userId: 1, writtenAt: -1 }),
    db.collection('media_assets').createIndex({ userId: 1, createdAt: -1 }),
    db.collection('interests').createIndex({ userId: 1, type: 1, name: 1 }),
    db.collection('learning_vocabulary').createIndex({ userId: 1, language: 1, word: 1 }),
    db.collection('learning_study_logs').createIndex({ userId: 1, studiedAt: -1 }),
  ]);
  console.log('Migration up completed: indexes are ready');
  await mongoose.disconnect();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
