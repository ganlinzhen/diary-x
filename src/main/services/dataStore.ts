import Store from 'electron-store'
import { v4 as uuidv4 } from 'uuid'
import { Diary, Segment, Topic, SegmentTopic, Plan, PlanTodo, SegmentPlan, Anniversary } from '../db/models'
import { parseMarkdownToSegments } from '../utils/markdown'

interface StoreSchema {
  diaries: Record<string, Diary>
  segments: Record<string, Segment>
  topics: Record<string, Topic>
  segmentTopics: Record<string, SegmentTopic>
  plans: Record<string, Plan>
  planTodos: Record<string, PlanTodo>
  segmentPlans: Record<string, SegmentPlan>
  anniversaries: Record<string, Anniversary>
}

class DataStore {
  private store: Store<StoreSchema>

  constructor() {
    this.store = new Store<StoreSchema>({
      defaults: {
        diaries: {},
        segments: {},
        topics: {},
        segmentTopics: {},
        plans: {},
        planTodos: {},
        segmentPlans: {},
        anniversaries: {}
      }
    })
  }

  // ========== Diary Operations ==========

  getDiary(date: string): Diary | null {
    const diaries = this.store.get('diaries')
    return Object.values(diaries).find(d => d.date === date) || null
  }

  saveDiary(diary: Omit<Diary, 'id' | 'createdAt'> & { id?: string }): Diary {
    const now = Date.now()
    const existing = this.getDiary(diary.date)

    let savedDiary: Diary

    if (existing) {
      // 更新现有日记
      savedDiary = {
        ...existing,
        title: diary.title,
        content: diary.content,
        updatedAt: now
      }
    } else {
      // 创建新日记
      savedDiary = {
        id: diary.id || uuidv4(),
        date: diary.date,
        title: diary.title,
        content: diary.content,
        createdAt: now,
        updatedAt: now
      }
    }

    const diaries = this.store.get('diaries')
    diaries[savedDiary.id] = savedDiary
    this.store.set('diaries', diaries)

    // 解析并保存段落
    this.saveSegments(savedDiary.id, diary.content)

    return savedDiary
  }

  deleteDiary(id: string): boolean {
    const diaries = this.store.get('diaries')
    if (!diaries[id]) return false

    delete diaries[id]
    this.store.set('diaries', diaries)

    // 删除关联的段落
    this.deleteSegmentsByDiary(id)

    return true
  }

  listDiaries(startDate: string, endDate: string): Diary[] {
    const diaries = Object.values(this.store.get('diaries'))
    return diaries
      .filter(d => d.date >= startDate && d.date <= endDate)
      .sort((a, b) => b.date.localeCompare(a.date))
  }

  searchDiaries(keyword: string): Diary[] {
    const diaries = Object.values(this.store.get('diaries'))
    const lowerKeyword = keyword.toLowerCase()
    return diaries
      .filter(d =>
        d.title.toLowerCase().includes(lowerKeyword) ||
        d.content.toLowerCase().includes(lowerKeyword)
      )
      .sort((a, b) => b.date.localeCompare(a.date))
  }

  // ========== Segment Operations ==========

  private saveSegments(diaryId: string, content: string): void {
    // 删除旧段落
    this.deleteSegmentsByDiary(diaryId)

    // 解析新段落
    const parsedSegments = parseMarkdownToSegments(content)
    const now = Date.now()

    const segments = this.store.get('segments')

    parsedSegments.forEach((parsed, index) => {
      const segment: Segment = {
        id: uuidv4(),
        diaryId,
        content: parsed.content,
        startLine: parsed.startLine,
        endLine: parsed.endLine,
        order: index,
        createdAt: now,
        updatedAt: now
      }
      segments[segment.id] = segment
    })

    this.store.set('segments', segments)
  }

  private deleteSegmentsByDiary(diaryId: string): void {
    const segments = this.store.get('segments')
    const segmentIds = Object.keys(segments).filter(id => segments[id].diaryId === diaryId)

    segmentIds.forEach(id => {
      delete segments[id]
      // 同时删除段落的主题关联
      this.deleteSegmentTopicsBySegment(id)
    })

    this.store.set('segments', segments)
  }

  getSegmentsByDiary(diaryId: string): Array<Segment & { topicIds: string[]; planIds: string[] }> {
    const segments = Object.values(this.store.get('segments'))
      .filter(s => s.diaryId === diaryId)
      .sort((a, b) => a.order - b.order)

    return segments.map(segment => ({
      ...segment,
      topicIds: this.getSegmentTopics(segment.id),
      planIds: this.getSegmentPlans(segment.id)
    }))
  }

  getSegmentsByTopic(topicId: string): Array<Segment & { diaryDate: string }> {
    const segmentTopics = Object.values(this.store.get('segmentTopics'))
      .filter(st => st.topicId === topicId)

    const segments = this.store.get('segments')
    const diaries = this.store.get('diaries')

    return segmentTopics
      .map(st => segments[st.segmentId])
      .filter(Boolean)
      .map(segment => {
        const diary = diaries[segment.diaryId]
        return {
          ...segment,
          diaryDate: diary?.date || ''
        }
      })
      .sort((a, b) => b.diaryDate.localeCompare(a.diaryDate))
  }

  getSegmentsByPlan(planId: string): Array<Segment & { diaryDate: string }> {
    const segmentPlans = Object.values(this.store.get('segmentPlans'))
      .filter(sp => sp.planId === planId)

    const segments = this.store.get('segments')
    const diaries = this.store.get('diaries')

    return segmentPlans
      .map(sp => segments[sp.segmentId])
      .filter(Boolean)
      .map(segment => {
        const diary = diaries[segment.diaryId]
        return {
          ...segment,
          diaryDate: diary?.date || ''
        }
      })
      .sort((a, b) => b.diaryDate.localeCompare(a.diaryDate))
  }

  // ========== Segment-Topic Operations ==========

  updateSegmentTopics(segmentId: string, topicIds: string[]): void {
    // 删除旧的关联
    this.deleteSegmentTopicsBySegment(segmentId)

    // 创建新的关联
    const now = Date.now()
    const segmentTopics = this.store.get('segmentTopics')

    topicIds.forEach(topicId => {
      const st: SegmentTopic = {
        id: uuidv4(),
        segmentId,
        topicId,
        createdAt: now
      }
      segmentTopics[st.id] = st
    })

    this.store.set('segmentTopics', segmentTopics)
  }

  private deleteSegmentTopicsBySegment(segmentId: string): void {
    const segmentTopics = this.store.get('segmentTopics')
    const ids = Object.keys(segmentTopics).filter(id => segmentTopics[id].segmentId === segmentId)

    ids.forEach(id => delete segmentTopics[id])
    this.store.set('segmentTopics', segmentTopics)
  }

  getSegmentTopics(segmentId: string): string[] {
    const segmentTopics = Object.values(this.store.get('segmentTopics'))
      .filter(st => st.segmentId === segmentId)
    return segmentTopics.map(st => st.topicId)
  }

  // ========== Topic Operations ==========

  listTopics(): Topic[] {
    return Object.values(this.store.get('topics'))
      .sort((a, b) => b.createdAt - a.createdAt)
  }

  getTopic(id: string): Topic | null {
    return this.store.get('topics')[id] || null
  }

  createTopic(topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>): Topic {
    const now = Date.now()
    const newTopic: Topic = {
      id: uuidv4(),
      ...topic,
      createdAt: now,
      updatedAt: now
    }

    const topics = this.store.get('topics')
    topics[newTopic.id] = newTopic
    this.store.set('topics', topics)

    return newTopic
  }

  updateTopic(id: string, updates: Partial<Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>>): boolean {
    const topics = this.store.get('topics')
    const topic = topics[id]

    if (!topic) return false

    const updatedTopic = {
      ...topic,
      ...updates,
      updatedAt: Date.now()
    }

    topics[id] = updatedTopic
    this.store.set('topics', topics)

    return true
  }

  deleteTopic(id: string): boolean {
    const topics = this.store.get('topics')
    if (!topics[id]) return false

    delete topics[id]
    this.store.set('topics', topics)

    // 删除相关的段落-主题关联
    const segmentTopics = this.store.get('segmentTopics')
    const idsToDelete = Object.keys(segmentTopics).filter(stId => segmentTopics[stId].topicId === id)
    idsToDelete.forEach(stId => delete segmentTopics[stId])
    this.store.set('segmentTopics', segmentTopics)

    return true
  }

  getTopicStats(): Array<{ topic: Topic; count: number }> {
    const topics = Object.values(this.store.get('topics'))
    const segmentTopics = Object.values(this.store.get('segmentTopics'))

    return topics.map(topic => {
      const count = segmentTopics.filter(st => st.topicId === topic.id).length
      return { topic, count }
    }).sort((a, b) => b.count - a.count || a.topic.name.localeCompare(b.topic.name))
  }

  // ========== Plan Operations ==========

  listPlans(): Plan[] {
    return Object.values(this.store.get('plans'))
      .sort((a, b) => b.createdAt - a.createdAt)
  }

  getPlan(id: string): Plan | null {
    return this.store.get('plans')[id] || null
  }

  createPlan(plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>): Plan {
    const now = Date.now()
    const newPlan: Plan = {
      id: uuidv4(),
      ...plan,
      createdAt: now,
      updatedAt: now
    }

    const plans = this.store.get('plans')
    plans[newPlan.id] = newPlan
    this.store.set('plans', plans)

    return newPlan
  }

  updatePlan(id: string, updates: Partial<Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>>): boolean {
    const plans = this.store.get('plans')
    const plan = plans[id]

    if (!plan) return false

    const updatedPlan = {
      ...plan,
      ...updates,
      updatedAt: Date.now()
    }

    plans[id] = updatedPlan
    this.store.set('plans', plans)

    return true
  }

  deletePlan(id: string): boolean {
    const plans = this.store.get('plans')
    if (!plans[id]) return false

    delete plans[id]
    this.store.set('plans', plans)

    // 删除相关的 todos
    const planTodos = this.store.get('planTodos')
    const todoIdsToDelete = Object.keys(planTodos).filter(todoId => planTodos[todoId].planId === id)
    todoIdsToDelete.forEach(todoId => delete planTodos[todoId])
    this.store.set('planTodos', planTodos)

    // 删除相关的段落-计划关联
    const segmentPlans = this.store.get('segmentPlans')
    const idsToDelete = Object.keys(segmentPlans).filter(spId => segmentPlans[spId].planId === id)
    idsToDelete.forEach(spId => delete segmentPlans[spId])
    this.store.set('segmentPlans', segmentPlans)

    return true
  }

  getPlanStats(): Array<{ plan: Plan; count: number }> {
    const plans = Object.values(this.store.get('plans'))
    const segmentPlans = Object.values(this.store.get('segmentPlans'))

    return plans.map(plan => {
      const count = segmentPlans.filter(sp => sp.planId === plan.id).length
      return { plan, count }
    }).sort((a, b) => b.count - a.count || a.plan.name.localeCompare(b.plan.name))
  }

  // ========== PlanTodo Operations ==========

  listPlanTodos(planId: string): PlanTodo[] {
    return Object.values(this.store.get('planTodos'))
      .filter(todo => todo.planId === planId)
      .sort((a, b) => a.order - b.order)
  }

  createPlanTodo(todo: Omit<PlanTodo, 'id' | 'createdAt' | 'updatedAt'>): PlanTodo {
    const now = Date.now()
    const newTodo: PlanTodo = {
      id: uuidv4(),
      ...todo,
      createdAt: now,
      updatedAt: now
    }

    const planTodos = this.store.get('planTodos')
    planTodos[newTodo.id] = newTodo
    this.store.set('planTodos', planTodos)

    return newTodo
  }

  updatePlanTodo(id: string, updates: Partial<Omit<PlanTodo, 'id' | 'planId' | 'createdAt' | 'updatedAt'>>): boolean {
    const planTodos = this.store.get('planTodos')
    const todo = planTodos[id]

    if (!todo) return false

    const updatedTodo = {
      ...todo,
      ...updates,
      updatedAt: Date.now()
    }

    planTodos[id] = updatedTodo
    this.store.set('planTodos', planTodos)

    return true
  }

  deletePlanTodo(id: string): boolean {
    const planTodos = this.store.get('planTodos')
    if (!planTodos[id]) return false

    delete planTodos[id]
    this.store.set('planTodos', planTodos)

    return true
  }

  // ========== Segment-Plan Operations ==========

  updateSegmentPlans(segmentId: string, planIds: string[]): void {
    // 删除旧的关联
    this.deleteSegmentPlansBySegment(segmentId)

    // 创建新的关联
    const now = Date.now()
    const segmentPlans = this.store.get('segmentPlans')

    planIds.forEach(planId => {
      const sp: SegmentPlan = {
        id: uuidv4(),
        segmentId,
        planId,
        createdAt: now
      }
      segmentPlans[sp.id] = sp
    })

    this.store.set('segmentPlans', segmentPlans)
  }

  private deleteSegmentPlansBySegment(segmentId: string): void {
    const segmentPlans = this.store.get('segmentPlans')
    const ids = Object.keys(segmentPlans).filter(id => segmentPlans[id].segmentId === segmentId)

    ids.forEach(id => delete segmentPlans[id])
    this.store.set('segmentPlans', segmentPlans)
  }

  getSegmentPlans(segmentId: string): string[] {
    const segmentPlans = Object.values(this.store.get('segmentPlans'))
      .filter(sp => sp.segmentId === segmentId)
    return segmentPlans.map(sp => sp.planId)
  }

  // ========== Anniversary Operations ==========

  listAnniversaries(): Anniversary[] {
    return Object.values(this.store.get('anniversaries'))
      .sort((a, b) => {
        const dateA = new Date(`2000-${a.date}`)
        const dateB = new Date(`2000-${b.date}`)
        return dateA.getTime() - dateB.getTime()
      })
  }

  getAnniversary(id: string): Anniversary | null {
    return this.store.get('anniversaries')[id] || null
  }

  createAnniversary(anniversary: Omit<Anniversary, 'id' | 'createdAt' | 'updatedAt'>): Anniversary {
    const now = Date.now()
    const newAnniversary: Anniversary = {
      id: uuidv4(),
      ...anniversary,
      createdAt: now,
      updatedAt: now
    }

    const anniversaries = this.store.get('anniversaries')
    anniversaries[newAnniversary.id] = newAnniversary
    this.store.set('anniversaries', anniversaries)

    return newAnniversary
  }

  updateAnniversary(id: string, updates: Partial<Omit<Anniversary, 'id' | 'createdAt' | 'updatedAt'>>): boolean {
    const anniversaries = this.store.get('anniversaries')
    const anniversary = anniversaries[id]

    if (!anniversary) return false

    const updatedAnniversary = {
      ...anniversary,
      ...updates,
      updatedAt: Date.now()
    }

    anniversaries[id] = updatedAnniversary
    this.store.set('anniversaries', anniversaries)

    return true
  }

  deleteAnniversary(id: string): boolean {
    const anniversaries = this.store.get('anniversaries')
    if (!anniversaries[id]) return false

    delete anniversaries[id]
    this.store.set('anniversaries', anniversaries)

    return true
  }

  getUpcomingAnniversaries(days: number = 30): Anniversary[] {
    const anniversaries = this.listAnniversaries()
    const today = new Date()
    const upcoming: Anniversary[] = []

    anniversaries.forEach(anniversary => {
      if (!anniversary.yearlyRepeat) return

      const [month, day] = anniversary.date.split('-').map(Number)
      const thisYearDate = new Date(today.getFullYear(), month - 1, day)
      const nextYearDate = new Date(today.getFullYear() + 1, month - 1, day)

      const daysUntilThisYear = Math.ceil((thisYearDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      const daysUntilNextYear = Math.ceil((nextYearDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      if (daysUntilThisYear >= 0 && daysUntilThisYear <= days) {
        upcoming.push(anniversary)
      } else if (daysUntilNextYear >= 0 && daysUntilNextYear <= days) {
        upcoming.push(anniversary)
      }
    })

    return upcoming
  }
}

// 单例模式
let dataStoreInstance: DataStore | null = null

export function getDataStore(): DataStore {
  if (!dataStoreInstance) {
    dataStoreInstance = new DataStore()
  }
  return dataStoreInstance
}
