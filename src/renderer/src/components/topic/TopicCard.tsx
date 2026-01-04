import { Topic } from '../../types/diary'
import { FileText } from 'lucide-react'
import { Card, CardHeader, CardContent } from '../ui/card'

interface TopicCardProps {
  topic: Topic
  count: number
  onClick: () => void
}

export default function TopicCard({ topic, count, onClick }: TopicCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: topic.color + '20' }}
          >
            <span className="text-2xl" style={{ color: topic.color }}>
              {topic.icon || '📌'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FileText className="w-4 h-4" />
            <span>{count} 个段落</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{topic.name}</h3>

        {topic.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{topic.description}</p>
        )}
      </CardContent>
    </Card>
  )
}
