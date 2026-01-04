export interface Diary {
  id: string
  date: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
}

export interface Segment {
  id: string
  diaryId: string
  content: string
  startLine: number
  endLine: number
  order: number
  createdAt: number
  updatedAt: number
  topicIds?: string[]
  planIds?: string[]
}

export interface Topic {
  id: string
  name: string
  color: string
  icon?: string
  description?: string
  createdAt: number
  updatedAt: number
}

export interface TopicStat {
  topic: Topic
  count: number
}

export interface Plan {
  id: string
  name: string
  color: string
  icon?: string
  description?: string
  startDate?: string
  endDate?: string
  createdAt: number
  updatedAt: number
}

export interface PlanTodo {
  id: string
  planId: string
  content: string
  completed: boolean
  order: number
  createdAt: number
  updatedAt: number
}

export interface PlanStat {
  plan: Plan
  count: number
}

export interface Anniversary {
  id: string
  person: string
  date: string
  eventType: string
  description?: string
  color: string
  icon?: string
  yearlyRepeat: boolean
  startYear?: number
  createdAt: number
  updatedAt: number
}
