import { contextBridge, ipcRenderer } from 'electron'

// 暴露给渲染进程的 API
const api = {
  // 日记相关
  diary: {
    getDiary: (date: string) => ipcRenderer.invoke('diary:get', date),
    saveDiary: (diary: any) => ipcRenderer.invoke('diary:save', diary),
    deleteDiary: (id: string) => ipcRenderer.invoke('diary:delete', id),
    listDiaries: (startDate: string, endDate: string) =>
      ipcRenderer.invoke('diary:list', startDate, endDate),
    searchDiaries: (keyword: string) =>
      ipcRenderer.invoke('diary:search', keyword)
  },

  // 段落相关
  segment: {
    getByDiary: (diaryId: string) =>
      ipcRenderer.invoke('segment:getByDiary', diaryId),
    getByTopic: (topicId: string) =>
      ipcRenderer.invoke('segment:getByTopic', topicId),
    updateTopics: (segmentId: string, topicIds: string[]) =>
      ipcRenderer.invoke('segment:updateTopics', segmentId, topicIds),
    updatePlans: (segmentId: string, planIds: string[]) =>
      ipcRenderer.invoke('segment:updatePlans', segmentId, planIds)
  },

  // 主题相关
  topic: {
    list: () => ipcRenderer.invoke('topic:list'),
    get: (id: string) => ipcRenderer.invoke('topic:get', id),
    create: (topic: any) => ipcRenderer.invoke('topic:create', topic),
    update: (id: string, updates: any) =>
      ipcRenderer.invoke('topic:update', id, updates),
    delete: (id: string) => ipcRenderer.invoke('topic:delete', id),
    getStats: () => ipcRenderer.invoke('topic:stats')
  },

  // 计划相关
  plan: {
    list: () => ipcRenderer.invoke('plan:list'),
    get: (id: string) => ipcRenderer.invoke('plan:get', id),
    create: (plan: any) => ipcRenderer.invoke('plan:create', plan),
    update: (id: string, updates: any) =>
      ipcRenderer.invoke('plan:update', id, updates),
    delete: (id: string) => ipcRenderer.invoke('plan:delete', id),
    getStats: () => ipcRenderer.invoke('plan:stats'),
    listTodos: (planId: string) => ipcRenderer.invoke('plan:listTodos', planId),
    createTodo: (todo: any) => ipcRenderer.invoke('plan:createTodo', todo),
    updateTodo: (id: string, updates: any) =>
      ipcRenderer.invoke('plan:updateTodo', id, updates),
    deleteTodo: (id: string) => ipcRenderer.invoke('plan:deleteTodo', id),
    getSegments: (planId: string) => ipcRenderer.invoke('plan:getSegments', planId)
  },

  // 纪念日相关
  anniversary: {
    list: () => ipcRenderer.invoke('anniversary:list'),
    get: (id: string) => ipcRenderer.invoke('anniversary:get', id),
    create: (anniversary: any) => ipcRenderer.invoke('anniversary:create', anniversary),
    update: (id: string, updates: any) =>
      ipcRenderer.invoke('anniversary:update', id, updates),
    delete: (id: string) => ipcRenderer.invoke('anniversary:delete', id),
    getUpcoming: (days?: number) => ipcRenderer.invoke('anniversary:upcoming', days)
  }
}

contextBridge.exposeInMainWorld('api', api)

export type API = typeof api
