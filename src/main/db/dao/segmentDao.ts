import { getDatabase } from '../index'
import { Segment } from '../models'
import { randomUUID } from 'crypto'

export class SegmentDao {
  private db = getDatabase()

  // 获取日记的所有段落
  getSegmentsByDiary(diaryId: string): Segment[] {
    const stmt = this.db.prepare(`
      SELECT * FROM segments
      WHERE diary_id = ?
      ORDER BY "order" ASC
    `)
    const results = stmt.all(diaryId) as any[]
    return results.map(this.mapRow)
  }

  // 获取主题的所有段落
  getSegmentsByTopic(topicId: string): Array<Segment & { diaryDate: string }> {
    const stmt = this.db.prepare(`
      SELECT s.*, d.date as diary_date
      FROM segments s
      INNER JOIN segment_topics st ON s.id = st.segment_id
      INNER JOIN diaries d ON s.diary_id = d.id
      WHERE st.topic_id = ?
      ORDER BY d.date DESC
    `)
    const results = stmt.all(topicId) as any[]
    return results.map((row) => ({
      ...this.mapRow(row),
      diaryDate: row.diary_date
    }))
  }

  // 保存段落
  saveSegments(diaryId: string, segments: Array<Omit<Segment, 'id' | 'diaryId' | 'createdAt' | 'updatedAt'>>): void {
    const now = Date.now()

    // 删除该日记的所有旧段落
    this.db.prepare('DELETE FROM segments WHERE diary_id = ?').run(diaryId)

    // 插入新段落
    const stmt = this.db.prepare(`
      INSERT INTO segments (id, diary_id, content, start_line, end_line, "order", created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const insertMany = this.db.transaction((segments: typeof segments) => {
      for (const segment of segments) {
        stmt.run(
          randomUUID(),
          diaryId,
          segment.content,
          segment.startLine,
          segment.endLine,
          segment.order,
          now,
          now
        )
      }
    })

    insertMany(segments)
  }

  // 更新段落的主题
  updateSegmentTopics(segmentId: string, topicIds: string[]): void {
    const now = Date.now()

    // 删除该段落的所有旧主题关联
    this.db.prepare('DELETE FROM segment_topics WHERE segment_id = ?').run(segmentId)

    if (topicIds.length === 0) return

    // 插入新的主题关联
    const stmt = this.db.prepare(`
      INSERT INTO segment_topics (id, segment_id, topic_id, created_at)
      VALUES (?, ?, ?, ?)
    `)

    const insertMany = this.db.transaction((topicIds: string[]) => {
      for (const topicId of topicIds) {
        stmt.run(randomUUID(), segmentId, topicId, now)
      }
    })

    insertMany(topicIds)
  }

  // 获取段落的主题
  getSegmentTopics(segmentId: string): string[] {
    const stmt = this.db.prepare(`
      SELECT topic_id FROM segment_topics WHERE segment_id = ?
    `)
    const results = stmt.all(segmentId) as Array<{ topic_id: string }>
    return results.map((r) => r.topic_id)
  }

  private mapRow(row: any): Segment {
    return {
      id: row.id,
      diaryId: row.diary_id,
      content: row.content,
      startLine: row.start_line,
      endLine: row.end_line,
      order: row.order,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }
  }
}
