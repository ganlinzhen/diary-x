// API 调用封装
import { Diary, Segment, Topic, TopicStat, Plan, PlanStat, PlanTodo, Anniversary } from '../types/diary'

const api = window.api

export const diaryApi = {
  get: (date: string) => api.diary.getDiary(date) as Promise<Diary | null>,
  save: (diary: Partial<Diary> & { date: string; title: string; content: string }) =>
    api.diary.saveDiary(diary) as Promise<Diary>,
  delete: (id: string) => api.diary.deleteDiary(id) as Promise<boolean>,
  list: (startDate: string, endDate: string) =>
    api.diary.listDiaries(startDate, endDate) as Promise<Diary[]>,
  search: (keyword: string) => api.diary.searchDiaries(keyword) as Promise<Diary[]>
}

export const segmentApi = {
  getByDiary: (diaryId: string) =>
    api.segment.getByDiary(diaryId) as Promise<Segment[]>,
  getByTopic: (topicId: string) =>
    api.segment.getByTopic(topicId) as Promise<(Segment & { diaryDate: string })[]>,
  updateTopics: (segmentId: string, topicIds: string[]) =>
    api.segment.updateTopics(segmentId, topicIds) as Promise<boolean>,
  updatePlans: (segmentId: string, planIds: string[]) =>
    api.segment.updatePlans(segmentId, planIds) as Promise<boolean>
}

export const topicApi = {
  list: () => api.topic.list() as Promise<Topic[]>,
  get: (id: string) => api.topic.get(id) as Promise<Topic | null>,
  create: (topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.topic.create(topic) as Promise<Topic>,
  update: (id: string, updates: Partial<Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.topic.update(id, updates) as Promise<boolean>,
  delete: (id: string) => api.topic.delete(id) as Promise<boolean>,
  getStats: () => api.topic.getStats() as Promise<TopicStat[]>
}

export const planApi = {
  list: () => api.plan.list() as Promise<Plan[]>,
  get: (id: string) => api.plan.get(id) as Promise<Plan | null>,
  create: (plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.plan.create(plan) as Promise<Plan>,
  update: (id: string, updates: Partial<Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.plan.update(id, updates) as Promise<boolean>,
  delete: (id: string) => api.plan.delete(id) as Promise<boolean>,
  getStats: () => api.plan.getStats() as Promise<PlanStat[]>,
  listTodos: (planId: string) => api.plan.listTodos(planId) as Promise<PlanTodo[]>,
  createTodo: (todo: Omit<PlanTodo, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.plan.createTodo(todo) as Promise<PlanTodo>,
  updateTodo: (id: string, updates: Partial<Omit<PlanTodo, 'id' | 'planId' | 'createdAt' | 'updatedAt'>>) =>
    api.plan.updateTodo(id, updates) as Promise<boolean>,
  deleteTodo: (id: string) => api.plan.deleteTodo(id) as Promise<boolean>,
  getSegments: (planId: string) => api.plan.getSegments(planId) as Promise<(Segment & { diaryDate: string })[]>
}

export const anniversaryApi = {
  list: () => api.anniversary.list() as Promise<Anniversary[]>,
  get: (id: string) => api.anniversary.get(id) as Promise<Anniversary | null>,
  create: (anniversary: Omit<Anniversary, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.anniversary.create(anniversary) as Promise<Anniversary>,
  update: (id: string, updates: Partial<Omit<Anniversary, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.anniversary.update(id, updates) as Promise<boolean>,
  delete: (id: string) => api.anniversary.delete(id) as Promise<boolean>,
  getUpcoming: (days?: number) => api.anniversary.getUpcoming(days) as Promise<Anniversary[]>
}
