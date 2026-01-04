import { getDatabase } from '../index'
import { Diary } from '../models'
import { randomUUID } from 'crypto'

export class DiaryDao {
  private db = getDatabase()

  // 获取指定日期的日记
  getDiary(date: string): Diary | null {
    const stmt = this.db.prepare(`
      SELECT * FROM diaries WHERE date = ?
    `)
    const result = stmt.get(date) as any
    return result ? this.mapRow(result) : null
  }

  // 保存或更新日记
  saveDiary(diary: Omit<Diary, 'id' | 'createdAt'> & { id?: string }): Diary {
    const now = Date.now()
    const existing = this.getDiary(diary.date)

    if (existing) {
      // 更新现有日记
      const stmt = this.db.prepare(`
        UPDATE diaries
        SET title = ?, content = ?, updated_at = ?
        WHERE date = ?
      `)
      stmt.run(diary.title, diary.content, now, diary.date)
      return { ...existing, title: diary.title, content: diary.content, updatedAt: now }
    } else {
      // 创建新日记
      const id = diary.id || randomUUID()
      const stmt = this.db.prepare(`
        INSERT INTO diaries (id, date, title, content, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      stmt.run(id, diary.date, diary.title, diary.content, now, now)
      return { id, ...diary, createdAt: now, updatedAt: now } as Diary
    }
  }

  // 删除日记
  deleteDiary(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM diaries WHERE id = ?')
    const result = stmt.run(id)
    return result.changes > 0
  }

  // 列出日期范围内的日记
  listDiaries(startDate: string, endDate: string): Diary[] {
    const stmt = this.db.prepare(`
      SELECT * FROM diaries
      WHERE date BETWEEN ? AND ?
      ORDER BY date DESC
    `)
    const results = stmt.all(startDate, endDate) as any[]
    return results.map(this.mapRow)
  }

  // 搜索日记
  searchDiaries(keyword: string): Diary[] {
    const stmt = this.db.prepare(`
      SELECT * FROM diaries
      WHERE title LIKE ? OR content LIKE ?
      ORDER BY date DESC
    `)
    const pattern = `%${keyword}%`
    const results = stmt.all(pattern, pattern) as any[]
    return results.map(this.mapRow)
  }

  // 获取日记列表（带分页）
  listDiariesWithPagination(limit: number, offset: number): { diaries: Diary[]; total: number } {
    const stmt = this.db.prepare(`
      SELECT * FROM diaries
      ORDER BY date DESC
      LIMIT ? OFFSET ?
    `)
    const countStmt = this.db.prepare('SELECT COUNT(*) as count FROM diaries')

    const results = stmt.all(limit, offset) as any[]
    const { count } = countStmt.get() as { count: number }

    return {
      diaries: results.map(this.mapRow),
      total: count
    }
  }

  private mapRow(row: any): Diary {
    return {
      id: row.id,
      date: row.date,
      title: row.title,
      content: row.content,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }
  }
}
