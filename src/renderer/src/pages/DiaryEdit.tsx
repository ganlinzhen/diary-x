import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { Calendar, Save, Trash2 } from 'lucide-react'
import { useDiaryStore } from '../stores/diaryStore'
import { useTopicStore } from '../stores/topicStore'
import { usePlanStore } from '../stores/planStore'
import MarkdownEditor from '../components/editor/MarkdownEditor'
import SegmentList from '../components/diary/SegmentList'
import { Button } from '../components/ui/button'

export default function DiaryEdit() {
  const { date } = useParams()
  const navigate = useNavigate()

  const {
    currentDiary,
    selectedDate,
    loading,
    setSelectedDate,
    loadDiary,
    saveDiary,
    deleteDiary
  } = useDiaryStore()

  const { loadTopics } = useTopicStore()
  const { loadPlans } = usePlanStore()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [showSegments, setShowSegments] = useState(false)

  useEffect(() => {
    loadTopics()
    loadPlans()
  }, [])

  useEffect(() => {
    if (date) {
      setSelectedDate(date)
    } else {
      setSelectedDate(format(new Date(), 'yyyy-MM-dd'))
    }
  }, [date, setSelectedDate])

  useEffect(() => {
    loadDiary(selectedDate)
  }, [selectedDate])

  useEffect(() => {
    if (currentDiary) {
      setTitle(currentDiary.title)
      setContent(currentDiary.content)
    } else {
      setTitle('')
      setContent('')
    }
  }, [currentDiary])

  const handleSave = async () => {
    try {
      await saveDiary(title, content)
      setShowSegments(true)
    } catch (error) {
      alert('保存失败: ' + (error as Error).message)
    }
  }

  const handleDelete = async () => {
    if (!currentDiary) return
    if (!confirm('确定要删除这篇日记吗？')) return

    try {
      await deleteDiary(currentDiary.id)
      setTitle('')
      setContent('')
      setShowSegments(false)
    } catch (error) {
      alert('删除失败: ' + (error as Error).message)
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    navigate(`/diary/${newDate}`)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="日记标题..."
              className="px-4 py-2 text-lg font-semibold border-none focus:outline-none w-96"
            />
          </div>

          <div className="flex items-center gap-2">
            {currentDiary && (
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
                删除
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={loading}
            >
              <Save className="w-4 h-4" />
              {loading ? '保存中...' : '保存'}
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 overflow-auto">
          <MarkdownEditor value={content} onChange={setContent} />
        </div>

        {/* Segments Sidebar */}
        {showSegments && currentDiary && (
          <div className="w-96 border-l border-gray-200 bg-white overflow-auto">
            <SegmentList diaryId={currentDiary.id} />
          </div>
        )}
      </div>
    </div>
  )
}
