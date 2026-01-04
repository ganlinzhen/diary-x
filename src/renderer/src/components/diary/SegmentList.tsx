import { useEffect, useState } from 'react'
import { Segment } from '../../types/diary'
import { segmentApi } from '../../api/electron'
import { useTopicStore } from '../../stores/topicStore'
import { usePlanStore } from '../../stores/planStore'
import TopicSelector from '../topic/TopicSelector'
import PlanSelector from '../plan/PlanSelector'
import { Card, CardContent } from '../ui/card'

interface SegmentListProps {
  diaryId: string
}

export default function SegmentList({ diaryId }: SegmentListProps) {
  const [segments, setSegments] = useState<Segment[]>([])
  const [loading, setLoading] = useState(false)
  const { topics } = useTopicStore()
  const { plans } = usePlanStore()

  useEffect(() => {
    loadSegments()
  }, [diaryId])

  const loadSegments = async () => {
    setLoading(true)
    try {
      const data = await segmentApi.getByDiary(diaryId)
      setSegments(data)
    } catch (error) {
      console.error('Failed to load segments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTopicsChange = async (segmentId: string, topicIds: string[]) => {
    try {
      await segmentApi.updateTopics(segmentId, topicIds)
      setSegments((prev) =>
        prev.map((s) => (s.id === segmentId ? { ...s, topicIds } : s))
      )
    } catch (error) {
      alert('更新主题失败: ' + (error as Error).message)
    }
  }

  const handlePlansChange = async (segmentId: string, planIds: string[]) => {
    try {
      await segmentApi.updatePlans(segmentId, planIds)
      setSegments((prev) =>
        prev.map((s) => (s.id === segmentId ? { ...s, planIds } : s))
      )
    } catch (error) {
      alert('更新计划失败: ' + (error as Error).message)
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        加载中...
      </div>
    )
  }

  if (segments.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        暂无段落，保存日记后会自动识别段落
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">段落列表</h3>
        <span className="text-sm text-gray-500">{segments.length} 个段落</span>
      </div>

      {segments.map((segment, index) => (
        <Card key={segment.id}>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-start justify-between">
              <span className="text-xs text-gray-500">段落 {index + 1}</span>
            </div>

            <div className="text-sm text-gray-700 line-clamp-3 bg-gray-50 p-3 rounded">
              {segment.content}
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">主题标签</label>
                <TopicSelector
                  selectedTopicIds={segment.topicIds || []}
                  topics={topics}
                  onChange={(topicIds) => handleTopicsChange(segment.id, topicIds)}
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1 block">关联计划</label>
                <PlanSelector
                  selectedPlanIds={segment.planIds || []}
                  plans={plans}
                  onChange={(planIds) => handlePlansChange(segment.id, planIds)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
