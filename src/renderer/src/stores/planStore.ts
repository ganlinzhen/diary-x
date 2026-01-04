import { create } from 'zustand'
import { Plan, PlanStat, PlanTodo } from '../types/diary'
import { planApi } from '../api/electron'

interface PlanState {
  plans: Plan[]
  planStats: PlanStat[]
  currentPlan: Plan | null
  todos: PlanTodo[]
  loading: boolean
  error: string | null

  // Actions
  loadPlans: () => Promise<void>
  loadPlanStats: () => Promise<void>
  loadPlan: (id: string) => Promise<void>
  createPlan: (plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Plan>
  updatePlan: (id: string, updates: Partial<Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>
  deletePlan: (id: string) => Promise<void>

  // Todo Actions
  loadTodos: (planId: string) => Promise<void>
  createTodo: (todo: Omit<PlanTodo, 'id' | 'createdAt' | 'updatedAt'>) => Promise<PlanTodo>
  updateTodo: (id: string, updates: Partial<Omit<PlanTodo, 'id' | 'planId' | 'createdAt' | 'updatedAt'>>) => Promise<void>
  deleteTodo: (id: string) => Promise<void>
  toggleTodo: (id: string) => Promise<void>
}

export const usePlanStore = create<PlanState>((set, get) => ({
  plans: [],
  planStats: [],
  currentPlan: null,
  todos: [],
  loading: false,
  error: null,

  loadPlans: async () => {
    set({ loading: true, error: null })
    try {
      const plans = await planApi.list()
      set({ plans, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  loadPlanStats: async () => {
    set({ loading: true, error: null })
    try {
      const planStats = await planApi.getStats()
      set({ planStats, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  loadPlan: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const plan = await planApi.get(id)
      set({ currentPlan: plan, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  createPlan: async (plan) => {
    set({ loading: true, error: null })
    try {
      const newPlan = await planApi.create(plan)
      set((state) => ({
        plans: [newPlan, ...state.plans],
        loading: false
      }))
      return newPlan
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  updatePlan: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      await planApi.update(id, updates)
      set((state) => ({
        plans: state.plans.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
        currentPlan: state.currentPlan?.id === id
          ? { ...state.currentPlan, ...updates }
          : state.currentPlan,
        loading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  deletePlan: async (id) => {
    set({ loading: true, error: null })
    try {
      await planApi.delete(id)
      set((state) => ({
        plans: state.plans.filter((p) => p.id !== id),
        currentPlan: state.currentPlan?.id === id ? null : state.currentPlan,
        loading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  loadTodos: async (planId: string) => {
    set({ loading: true, error: null })
    try {
      const todos = await planApi.listTodos(planId)
      set({ todos, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },

  createTodo: async (todo) => {
    set({ loading: true, error: null })
    try {
      const newTodo = await planApi.createTodo(todo)
      set((state) => ({
        todos: [...state.todos, newTodo],
        loading: false
      }))
      return newTodo
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  updateTodo: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      await planApi.updateTodo(id, updates)
      set((state) => ({
        todos: state.todos.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        ),
        loading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  deleteTodo: async (id) => {
    set({ loading: true, error: null })
    try {
      await planApi.deleteTodo(id)
      set((state) => ({
        todos: state.todos.filter((t) => t.id !== id),
        loading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
      throw error
    }
  },

  toggleTodo: async (id) => {
    const todo = get().todos.find((t) => t.id === id)
    if (!todo) return

    try {
      await get().updateTodo(id, { completed: !todo.completed })
    } catch (error) {
      console.error('Failed to toggle todo:', error)
    }
  }
}))
