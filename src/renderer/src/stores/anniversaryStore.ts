import { create } from 'zustand'
import { Anniversary } from '../types/diary'
import { anniversaryApi } from '../api/electron'

interface AnniversaryState {
  anniversaries: Anniversary[]
  upcomingAnniversaries: Anniversary[]
  loading: boolean
  error: string | null

  // Actions
  loadAnniversaries: () => Promise<void>
  loadUpcomingAnniversaries: (days?: number) => Promise<void>
  createAnniversary: (anniversary: Omit<Anniversary, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Anniversary>
  updateAnniversary: (id: string, updates: Partial<Omit<Anniversary, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>
  deleteAnniversary: (id: string) => Promise<void>
}

export const useAnniversaryStore = create<AnniversaryState>((set, get) => ({
  anniversaries: [],
  upcomingAnniversaries: [],
  loading: false,
  error: null,

  loadAnniversaries: async () => {
    set({ loading: true, error: null })
    try {
      const anniversaries = await anniversaryApi.list()
      set({ anniversaries, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  loadUpcomingAnniversaries: async (days = 30) => {
    set({ loading: true, error: null })
    try {
      const upcomingAnniversaries = await anniversaryApi.getUpcoming(days)
      set({ upcomingAnniversaries, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  createAnniversary: async (anniversary) => {
    set({ loading: true, error: null })
    try {
      const newAnniversary = await anniversaryApi.create(anniversary)
      set((state) => ({
        anniversaries: [newAnniversary, ...state.anniversaries],
        loading: false
      }))
      return newAnniversary
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  updateAnniversary: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      await anniversaryApi.update(id, updates)
      set((state) => ({
        anniversaries: state.anniversaries.map((a) =>
          a.id === id ? { ...a, ...updates } : a
        ),
        loading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  deleteAnniversary: async (id) => {
    set({ loading: true, error: null })
    try {
      await anniversaryApi.delete(id)
      set((state) => ({
        anniversaries: state.anniversaries.filter((a) => a.id !== id),
        loading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  }
}))
