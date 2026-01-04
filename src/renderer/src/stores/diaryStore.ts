import { create } from 'zustand'
import { Diary } from '../types/diary'
import { diaryApi } from '../api/electron'
import { format } from 'date-fns'

interface DiaryState {
  currentDiary: Diary | null
  diaries: Diary[]
  selectedDate: string
  loading: boolean
  error: string | null

  // Actions
  setSelectedDate: (date: string) => void
  loadDiary: (date: string) => Promise<void>
  saveDiary: (title: string, content: string) => Promise<void>
  deleteDiary: (id: string) => Promise<void>
  loadDiaries: (startDate: string, endDate: string) => Promise<void>
  searchDiaries: (keyword: string) => Promise<void>
}

export const useDiaryStore = create<DiaryState>((set, get) => ({
  currentDiary: null,
  diaries: [],
  selectedDate: format(new Date(), 'yyyy-MM-dd'),
  loading: false,
  error: null,

  setSelectedDate: (date) => {
    set({ selectedDate: date })
    get().loadDiary(date)
  },

  loadDiary: async (date) => {
    set({ loading: true, error: null })
    try {
      const diary = await diaryApi.get(date)
      set({ currentDiary: diary, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  saveDiary: async (title, content) => {
    const { selectedDate } = get()
    set({ loading: true, error: null })
    try {
      const diary = await diaryApi.save({
        date: selectedDate,
        title,
        content
      })
      set({ currentDiary: diary, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  deleteDiary: async (id) => {
    set({ loading: true, error: null })
    try {
      await diaryApi.delete(id)
      set({ currentDiary: null, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  loadDiaries: async (startDate, endDate) => {
    set({ loading: true, error: null })
    try {
      const diaries = await diaryApi.list(startDate, endDate)
      set({ diaries, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  searchDiaries: async (keyword) => {
    set({ loading: true, error: null })
    try {
      const diaries = await diaryApi.search(keyword)
      set({ diaries, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  }
}))
