// Script to recreate user_progress table without FK constraint
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'dotacodex.db');
const db = new Database(dbPath);

console.log('Dropping existing user_progress table...');
db.exec(`DROP TABLE IF EXISTS user_progress;`);

console.log('Creating user_progress table (without FK constraint)...');
db.exec(`
    CREATE TABLE user_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        topic_id INTEGER NOT NULL,
        completed INTEGER DEFAULT 0,
        score INTEGER,
        completed_at INTEGER
    );
`);

console.log('Creating index on user_progress...');
db.exec(`
    CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_progress_topic_id ON user_progress(topic_id);
`);

console.log('Done! user_progress table recreated successfully.');
db.close();
