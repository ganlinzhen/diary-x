import { create } from 'zustand'
import { Topic, TopicStat } from '../types/diary'
import { topicApi } from '../api/electron'

interface TopicState {
  topics: Topic[]
  topicStats: TopicStat[]
  loading: boolean
  error: string | null

  // Actions
  loadTopics: () => Promise<void>
  loadTopicStats: () => Promise<void>
  createTopic: (topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Topic>
  updateTopic: (id: string, updates: Partial<Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>
  deleteTopic: (id: string) => Promise<void>
}

export const useTopicStore = create<TopicState>((set, get) => ({
  topics: [],
  topicStats: [],
  loading: false,
  error: null,

  loadTopics: async () => {
    set({ loading: true, error: null })
    try {
      const topics = await topicApi.list()
      set({ topics, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  loadTopicStats: async () => {
    set({ loading: true, error: null })
    try {
      const topicStats = await topicApi.getStats()
      set({ topicStats, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  createTopic: async (topic) => {
    set({ loading: true, error: null })
    try {
      const newTopic = await topicApi.create(topic)
      set((state) => ({
        topics: [newTopic, ...state.topics],
        loading: false
      }))
      return newTopic
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  updateTopic: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      await topicApi.update(id, updates)
      set((state) => ({
        topics: state.topics.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        ),
        loading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  deleteTopic: async (id) => {
    set({ loading: true, error: null })
    try {
      await topicApi.delete(id)
      set((state) => ({
        topics: state.topics.filter((t) => t.id !== id),
        loading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  }
}))
