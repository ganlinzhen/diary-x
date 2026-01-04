import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar } from 'lucide-react'
import { Segment, Topic } from '../types/diary'
import { segmentApi, topicApi } from '../api/electron'
import ReactMarkdown from 'react-markdown'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'

export default function TopicDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [topic, setTopic] = useState<Topic | null>(null)
  const [segments, setSegments] = useState<Array<Segment & { diaryDate: string }>>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id) {
      loadData()
    }
  }, [id])

  const loadData = async () => {
    if (!id) return

    setLoading(true)
    try {
      const [topicData, segmentsData] = await Promise.all([
        topicApi.get(id),
        segmentApi.getByTopic(id)
      ])
      setTopic(topicData)
      setSegments(segmentsData)
    } catch (error) {
      console.error('Failed to load topic detail:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">加载中...</p>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">主题不存在</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/topics')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </Button>

        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl"
            style={{ backgroundColor: topic.color + '20' }}
          >
            <span style={{ color: topic.color }}>{topic.icon || '📌'}</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">{topic.name}</h1>
            {topic.description && (
              <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">{segments.length} 个相关段落</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {segments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            还没有标记为此主题的段落
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
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
  )
}
