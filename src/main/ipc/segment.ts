import { ipcMain } from 'electron'
import { getDataStore } from '../services/dataStore'

export function setupSegmentHandlers(): void {
  const store = getDataStore()

  // 获取日记的段落
  ipcMain.handle('segment:getByDiary', async (_, diaryId: string) => {
    try {
      return store.getSegmentsByDiary(diaryId)
    } catch (error) {
      console.error('Failed to get segments by diary:', error)
      throw error
    }
  })

  // 获取主题的段落
  ipcMain.handle('segment:getByTopic', async (_, topicId: string) => {
    try {
      return store.getSegmentsByTopic(topicId)
    } catch (error) {
      console.error('Failed to get segments by topic:', error)
      throw error
    }
  })

  // 更新段落的主题
  ipcMain.handle('segment:updateTopics', async (_, segmentId: string, topicIds: string[]) => {
    try {
      store.updateSegmentTopics(segmentId, topicIds)
      return true
    } catch (error) {
      console.error('Failed to update segment topics:', error)
      throw error
    }
  })

  // 更新段落的计划
  ipcMain.handle('segment:updatePlans', async (_, segmentId: string, planIds: string[]) => {
    try {
      store.updateSegmentPlans(segmentId, planIds)
      return true
    } catch (error) {
      console.error('Failed to update segment plans:', error)
      throw error
    }
  })
}
