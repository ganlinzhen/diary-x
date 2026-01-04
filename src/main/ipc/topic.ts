import { ipcMain } from 'electron'
import { getDataStore } from '../services/dataStore'

export function setupTopicHandlers(): void {
  const store = getDataStore()

  // 列出所有主题
  ipcMain.handle('topic:list', async () => {
    try {
      return store.listTopics()
    } catch (error) {
      console.error('Failed to list topics:', error)
      throw error
    }
  })

  // 获取单个主题
  ipcMain.handle('topic:get', async (_, id: string) => {
    try {
      return store.getTopic(id)
    } catch (error) {
      console.error('Failed to get topic:', error)
      throw error
    }
  })

  // 创建主题
  ipcMain.handle('topic:create', async (_, topic: any) => {
    try {
      return store.createTopic(topic)
    } catch (error) {
      console.error('Failed to create topic:', error)
      throw error
    }
  })

  // 更新主题
  ipcMain.handle('topic:update', async (_, id: string, updates: any) => {
    try {
      return store.updateTopic(id, updates)
    } catch (error) {
      console.error('Failed to update topic:', error)
      throw error
    }
  })

  // 删除主题
  ipcMain.handle('topic:delete', async (_, id: string) => {
    try {
      return store.deleteTopic(id)
    } catch (error) {
      console.error('Failed to delete topic:', error)
      throw error
    }
  })

  // 获取主题统计
  ipcMain.handle('topic:stats', async () => {
    try {
      return store.getTopicStats()
    } catch (error) {
      console.error('Failed to get topic stats:', error)
      throw error
    }
  })
}
