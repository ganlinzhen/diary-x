import { getDatabase } from '../index'
import { Topic } from '../models'
import { randomUUID } from 'crypto'

export class TopicDao {
  private db = getDatabase()

  // 获取所有主题
  listTopics(): Topic[] {
    const stmt = this.db.prepare(`
      SELECT * FROM topics
      ORDER BY created_at DESC
    `)
    const results = stmt.all() as any[]
    return results.map(this.mapRow)
  }

  // 获取单个主题
  getTopic(id: string): Topic | null {
    const stmt = this.db.prepare('SELECT * FROM topics WHERE id = ?')
    const result = stmt.get(id) as any
    return result ? this.mapRow(result) : null
  }

  // 创建主题
  createTopic(topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>): Topic {
    const now = Date.now()
    const id = randomUUID()

    const stmt = this.db.prepare(`
      INSERT INTO topics (id, name, color, icon, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(id, topic.name, topic.color, topic.icon || null, topic.description || null, now, now)

    return { id, ...topic, createdAt: now, updatedAt: now }
  }

  // 更新主题
  updateTopic(id: string, updates: Partial<Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>>): boolean {
    const now = Date.now()
    const fields: string[] = []
    const values: any[] = []

    if (updates.name !== undefined) {
      fields.push('name = ?')
      values.push(updates.name)
    }
    if (updates.color !== undefined) {
      fields.push('color = ?')
      values.push(updates.color)
    }
    if (updates.icon !== undefined) {
      fields.push('icon = ?')
      values.push(updates.icon)
    }
    if (updates.description !== undefined) {
      fields.push('description = ?')
      values.push(updates.description)
    }

    if (fields.length === 0) return false

    fields.push('updated_at = ?')
    values.push(now)
    values.push(id)

    const stmt = this.db.prepare(`
      UPDATE topics SET ${fields.join(', ')} WHERE id = ?
    `)

    const result = stmt.run(...values)
    return result.changes > 0
  }

  // 删除主题
  deleteTopic(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM topics WHERE id = ?')
    const result = stmt.run(id)
    return result.changes > 0
  }

  // 获取主题统计信息
  getTopicStats(): Array<{ topic: Topic; count: number }> {
    const stmt = this.db.prepare(`
      SELECT
        t.*,
        COUNT(DISTINCT st.segment_id) as segment_count
      FROM topics t
      LEFT JOIN segment_topics st ON t.id = st.topic_id
      GROUP BY t.id
      ORDER BY segment_count DESC, t.name ASC
    `)

    const results = stmt.all() as any[]

    return results.map((row) => ({
      topic: this.mapRow(row),
      count: row.segment_count
    }))
  }

  private mapRow(row: any): Topic {
    return {
      id: row.id,
      name: row.name,
      color: row.color,
      icon: row.icon || undefined,
      description: row.description || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }
  }
}
