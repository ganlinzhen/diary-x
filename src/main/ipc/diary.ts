import { ipcMain } from 'electron'
import { getDataStore } from '../services/dataStore'

export function setupDiaryHandlers(): void {
  const store = getDataStore()

  // 获取日记
  ipcMain.handle('diary:get', async (_, date: string) => {
    try {
      return store.getDiary(date)
    } catch (error) {
      console.error('Failed to get diary:', error)
      throw error
    }
  })

  // 保存日记
  ipcMain.handle('diary:save', async (_, diary: any) => {
    try {
      return store.saveDiary(diary)
    } catch (error) {
      console.error('Failed to save diary:', error)
      throw error
    }
  })

  // 删除日记
  ipcMain.handle('diary:delete', async (_, id: string) => {
    try {
      return store.deleteDiary(id)
    } catch (error) {
      console.error('Failed to delete diary:', error)
      throw error
    }
  })

  // 列出日记
  ipcMain.handle('diary:list', async (_, startDate: string, endDate: string) => {
    try {
      return store.listDiaries(startDate, endDate)
    } catch (error) {
      console.error('Failed to list diaries:', error)
      throw error
    }
  })

  // 搜索日记
  ipcMain.handle('diary:search', async (_, keyword: string) => {
    try {
      return store.searchDiaries(keyword)
    } catch (error) {
      console.error('Failed to search diaries:', error)
      throw error
    }
  })
}
