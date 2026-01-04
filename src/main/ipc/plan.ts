import { ipcMain } from 'electron'
import { getDataStore } from '../services/dataStore'

export function setupPlanHandlers(): void {
  const store = getDataStore()

  // 列出所有计划
  ipcMain.handle('plan:list', async () => {
    try {
      return store.listPlans()
    } catch (error) {
      console.error('Failed to list plans:', error)
      throw error
    }
  })

  // 获取单个计划
  ipcMain.handle('plan:get', async (_, id: string) => {
    try {
      return store.getPlan(id)
    } catch (error) {
      console.error('Failed to get plan:', error)
      throw error
    }
  })

  // 创建计划
  ipcMain.handle('plan:create', async (_, plan: any) => {
    try {
      return store.createPlan(plan)
    } catch (error) {
      console.error('Failed to create plan:', error)
      throw error
    }
  })

  // 更新计划
  ipcMain.handle('plan:update', async (_, id: string, updates: any) => {
    try {
      return store.updatePlan(id, updates)
    } catch (error) {
      console.error('Failed to update plan:', error)
      throw error
    }
  })

  // 删除计划
  ipcMain.handle('plan:delete', async (_, id: string) => {
    try {
      return store.deletePlan(id)
    } catch (error) {
      console.error('Failed to delete plan:', error)
      throw error
    }
  })

  // 获取计划统计
  ipcMain.handle('plan:stats', async () => {
    try {
      return store.getPlanStats()
    } catch (error) {
      console.error('Failed to get plan stats:', error)
      throw error
    }
  })

  // 获取计划的待办事项
  ipcMain.handle('plan:listTodos', async (_, planId: string) => {
    try {
      return store.listPlanTodos(planId)
    } catch (error) {
      console.error('Failed to list plan todos:', error)
      throw error
    }
  })

  // 创建待办事项
  ipcMain.handle('plan:createTodo', async (_, todo: any) => {
    try {
      return store.createPlanTodo(todo)
    } catch (error) {
      console.error('Failed to create plan todo:', error)
      throw error
    }
  })

  // 更新待办事项
  ipcMain.handle('plan:updateTodo', async (_, id: string, updates: any) => {
    try {
      return store.updatePlanTodo(id, updates)
    } catch (error) {
      console.error('Failed to update plan todo:', error)
      throw error
    }
  })

  // 删除待办事项
  ipcMain.handle('plan:deleteTodo', async (_, id: string) => {
    try {
      return store.deletePlanTodo(id)
    } catch (error) {
      console.error('Failed to delete plan todo:', error)
      throw error
    }
  })

  // 获取计划的相关段落
  ipcMain.handle('plan:getSegments', async (_, planId: string) => {
    try {
      return store.getSegmentsByPlan(planId)
    } catch (error) {
      console.error('Failed to get plan segments:', error)
      throw error
    }
  })
}
