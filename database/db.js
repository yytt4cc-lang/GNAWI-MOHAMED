import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db = null;

export async function getDatabase() {
  if (!db) {
    db = await open({
      filename: join(__dirname, '../quest_completer.db'),
      driver: sqlite3.Database,
    });
  }
  return db;
}

export async function initializeDatabase() {
  const database = await getDatabase();
  
  // Create users table
  await database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT UNIQUE NOT NULL,
      discord_token TEXT NOT NULL,
      account_name TEXT,
      autoquest_enabled INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create quest history table
  await database.exec(`
    CREATE TABLE IF NOT EXISTS quest_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      quest_id TEXT NOT NULL,
      quest_name TEXT,
      status TEXT,
      claimed_rewards INTEGER DEFAULT 0,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    )
  `);

  console.log('✅ Database initialized successfully');
}

export async function saveToken(userId, token, accountName) {
  const database = await getDatabase();
  await database.run(
    `INSERT OR REPLACE INTO users (user_id, discord_token, account_name, updated_at) 
     VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
    [userId, token, accountName]
  );
}

export async function getToken(userId) {
  const database = await getDatabase();
  const user = await database.get('SELECT discord_token FROM users WHERE user_id = ?', [userId]);
  return user?.discord_token || null;
}

export async function removeToken(userId) {
  const database = await getDatabase();
  await database.run('DELETE FROM users WHERE user_id = ?', [userId]);
}

export async function saveQuestHistory(userId, questId, questName, status, claimedRewards = 0) {
  const database = await getDatabase();
  await database.run(
    `INSERT INTO quest_history (user_id, quest_id, quest_name, status, claimed_rewards) 
     VALUES (?, ?, ?, ?, ?)`,
    [userId, questId, questName, status, claimedRewards]
  );
}
