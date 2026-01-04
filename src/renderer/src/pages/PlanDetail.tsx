import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Plus, X, Check } from 'lucide-react'
import { Segment, Plan, PlanTodo } from '../types/diary'
import { planApi } from '../api/electron'
import { usePlanStore } from '../stores/planStore'
import ReactMarkdown from 'react-markdown'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader } from '../components/ui/card'

export default function PlanDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { currentPlan, todos, loading: storeLoading, loadPlan, loadTodos, createTodo, toggleTodo, deleteTodo } = usePlanStore()
  const [segments, setSegments] = useState<Array<Segment & { diaryDate: string }>>([])
  const [loading, setLoading] = useState(false)
  const [newTodoContent, setNewTodoContent] = useState('')
  const [addingTodo, setAddingTodo] = useState(false)

  useEffect(() => {
    if (id) {
      loadData()
    }
  }, [id])

  const loadData = async () => {
    if (!id) return

    setLoading(true)
    try {
      await Promise.all([
        loadPlan(id),
        loadTodos(id),
        loadSegmentsData(id)
      ])
    } catch (error) {
      console.error('Failed to load plan detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSegmentsData = async (planId: string) => {
    try {
      const segmentsData = await planApi.getSegments(planId)
      setSegments(segmentsData)
    } catch (error) {
      console.error('Failed to load segments:', error)
    }
  }

  const handleAddTodo = async () => {
    if (!id || !newTodoContent.trim()) return

    setAddingTodo(true)
    try {
      const maxOrder = todos.length > 0 ? Math.max(...todos.map(t => t.order)) : -1
      await createTodo({
        planId: id,
        content: newTodoContent.trim(),
        completed: false,
        order: maxOrder + 1
      })
      setNewTodoContent('')
    } catch (error) {
      alert('添加失败: ' + (error as Error).message)
    } finally {
      setAddingTodo(false)
    }
  }

  if (loading || storeLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">加载中...</p>
      </div>
    )
  }

  if (!currentPlan) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">计划不存在</p>
      </div>
    )
  }

  const formatDateRange = () => {
    if (!currentPlan.startDate && !currentPlan.endDate) return null
    if (currentPlan.startDate && currentPlan.endDate) {
      return `${currentPlan.startDate} 至 ${currentPlan.endDate}`
    }
    if (currentPlan.startDate) return `开始: ${currentPlan.startDate}`
    if (currentPlan.endDate) return `结束: ${currentPlan.endDate}`
    return null
  }

  const dateRange = formatDateRange()
  const completedCount = todos.filter(t => t.completed).length
  const totalCount = todos.length

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/plans')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </Button>

        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl"
            style={{ backgroundColor: currentPlan.color + '20' }}
          >
            <span style={{ color: currentPlan.color }}>{currentPlan.icon || '🎯'}</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">{currentPlan.name}</h1>
            {currentPlan.description && (
              <p className="text-sm text-gray-600 mt-1">{currentPlan.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
              {dateRange && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{dateRange}</span>
                </div>
              )}
              <span>{segments.length} 个相关段落</span>
              {totalCount > 0 && (
                <span>{completedCount}/{totalCount} 任务完成</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Todo List - Left Column */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-800">待办事项</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {/* Add Todo Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTodoContent}
                      onChange={(e) => setNewTodoContent(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddTodo()
                        }
                      }}
                      placeholder="添加新任务..."
                      className="flex-1 h-9 rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
                    />
                    <Button
                      size="sm"
                      onClick={handleAddTodo}
                      disabled={addingTodo || !newTodoContent.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Todo Items */}
                  {todos.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">
                      还没有任务
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {todos.map((todo) => (
                        <div
                          key={todo.id}
                          className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 group"
                        >
                          <button
                            onClick={() => toggleTodo(todo.id)}
                            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              todo.completed
                                ? 'bg-blue-500 border-blue-500'
                                : 'border-gray-300 hover:border-blue-500'
                            }`}
                          >
                            {todo.completed && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </button>

                          <span
                            className={`flex-1 text-sm ${
                              todo.completed
                                ? 'line-through text-gray-400'
                                : 'text-gray-700'
                            }`}
                          >
                            {todo.content}
                          </span>

                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Segments - Right Column */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">相关日记段落</h2>
            {segments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  还没有标记为此计划的段落
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {segments.map((segment) => (
                  <Card key={segment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Calendar className="w-4 h-4" />
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => navigate(`/diary/${segment.diaryDate}`)}
                          className="h-auto p-0 text-gray-500 hover:text-blue-600"
                        >
                          {segment.diaryDate}
                        </Button>
                      </div>

                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>{segment.content}</ReactMarkdown>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
