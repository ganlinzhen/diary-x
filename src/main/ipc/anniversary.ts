import { ipcMain } from 'electron'
import { getDataStore } from '../services/dataStore'

export function setupAnniversaryHandlers(): void {
  const store = getDataStore()

  // 列出所有纪念日
  ipcMain.handle('anniversary:list', async () => {
    try {
      return store.listAnniversaries()
    } catch (error) {
      console.error('Failed to list anniversaries:', error)
      throw error
    }
  })

  // 获取单个纪念日
  ipcMain.handle('anniversary:get', async (_, id: string) => {
    try {
      return store.getAnniversary(id)
    } catch (error) {
      console.error('Failed to get anniversary:', error)
      throw error
    }
  })

  // 创建纪念日
  ipcMain.handle('anniversary:create', async (_, anniversary: any) => {
    try {
      return store.createAnniversary(anniversary)
    } catch (error) {
      console.error('Failed to create anniversary:', error)
      throw error
    }
  })

  // 更新纪念日
  ipcMain.handle('anniversary:update', async (_, id: string, updates: any) => {
    try {
      return store.updateAnniversary(id, updates)
    } catch (error) {
      console.error('Failed to update anniversary:', error)
      throw error
    }
  })

  // 删除纪念日
  ipcMain.handle('anniversary:delete', async (_, id: string) => {
    try {
      return store.deleteAnniversary(id)
    } catch (error) {
      console.error('Failed to delete anniversary:', error)
      throw error
    }
  })

  // 获取即将到来的纪念日
  ipcMain.handle('anniversary:upcoming', async (_, days: number = 30) => {
    try {
      return store.getUpcomingAnniversaries(days)
    } catch (error) {
      console.error('Failed to get upcoming anniversaries:', error)
      throw error
    }
  })
}
