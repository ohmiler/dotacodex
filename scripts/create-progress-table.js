// Script to create missing tables in local SQLite database
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'dotacodex.db');
const db = new Database(dbPath);

console.log('Creating user_progress table...');

db.exec(`
    CREATE TABLE IF NOT EXISTS user_progress (
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
`);

console.log('Done! user_progress table created.');
db.close();
