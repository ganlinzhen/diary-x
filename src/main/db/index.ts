import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

let db: Database.Database | null = null

export function initDatabase(): Database.Database {
  if (db) return db

  const userDataPath = app.getPath('userData')
  const dbPath = join(userDataPath, 'diary.db')

  // 确保目录存在
  if (!existsSync(userDataPath)) {
    mkdirSync(userDataPath, { recursive: true })
  }

  db = new Database(dbPath)

  // 开启 WAL 模式提高性能
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  // 执行数据库迁移
  runMigrations(db)

  return db
}

function runMigrations(db: Database.Database): void {
  // 创建版本表
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER PRIMARY KEY,
      applied_at INTEGER NOT NULL
    )
  `)

  const currentVersion = getCurrentVersion(db)

  // 迁移列表
  const migrations = [
    {
      version: 1,
      up: () => {
        db.exec(`
          -- 日记表
          CREATE TABLE IF NOT EXISTS diaries (
            id TEXT PRIMARY KEY,
            date TEXT NOT NULL UNIQUE,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
          );

          CREATE INDEX IF NOT EXISTS idx_diaries_date ON diaries(date DESC);

          -- 段落表
          CREATE TABLE IF NOT EXISTS segments (
            id TEXT PRIMARY KEY,
            diary_id TEXT NOT NULL,
            content TEXT NOT NULL,
            start_line INTEGER NOT NULL,
            end_line INTEGER NOT NULL,
            "order" INTEGER NOT NULL,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL,
            FOREIGN KEY (diary_id) REFERENCES diaries(id) ON DELETE CASCADE
          );

          CREATE INDEX IF NOT EXISTS idx_segments_diary_id ON segments(diary_id);
          CREATE INDEX IF NOT EXISTS idx_segments_order ON segments(diary_id, "order");

          -- 主题表
          CREATE TABLE IF NOT EXISTS topics (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            color TEXT NOT NULL,
            icon TEXT,
            description TEXT,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
          );

          CREATE INDEX IF NOT EXISTS idx_topics_name ON topics(name);

          -- 段落-主题关联表
          CREATE TABLE IF NOT EXISTS segment_topics (
            id TEXT PRIMARY KEY,
            segment_id TEXT NOT NULL,
            topic_id TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            FOREIGN KEY (segment_id) REFERENCES segments(id) ON DELETE CASCADE,
            FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
            UNIQUE(segment_id, topic_id)
          );

          CREATE INDEX IF NOT EXISTS idx_segment_topics_segment ON segment_topics(segment_id);
          CREATE INDEX IF NOT EXISTS idx_segment_topics_topic ON segment_topics(topic_id);
        `)
      }
    }
  ]

  // 执行需要的迁移
  for (const migration of migrations) {
    if (migration.version > currentVersion) {
      console.log(`Running migration ${migration.version}`)
      migration.up()
      setVersion(db, migration.version)
    }
  }
}

function getCurrentVersion(db: Database.Database): number {
  const result = db
    .prepare('SELECT MAX(version) as version FROM schema_version')
    .get() as { version: number | null }
  return result?.version || 0
}

function setVersion(db: Database.Database, version: number): void {
  db.prepare('INSERT INTO schema_version (version, applied_at) VALUES (?, ?)').run(
    version,
    Date.now()
  )
}

export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized')
  }
  return db
}

export function closeDatabase(): void {
  if (db) {
    db.close()
    db = null
  }
}
