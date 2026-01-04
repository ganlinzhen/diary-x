import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useTopicStore } from '../stores/topicStore'
import { Button } from '../components/ui/button'
import TopicCard from '../components/topic/TopicCard'
import CreateTopicModal from '../components/topic/CreateTopicModal'

export default function TopicList() {
  const navigate = useNavigate()
  const { topicStats, loading, loadTopicStats } = useTopicStore()
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    loadTopicStats()
  }, [])

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">主题管理</h1>
            <p className="text-sm text-gray-500 mt-1">查看和管理你的主题标签</p>
          </div>

          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            新建主题
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="text-center text-gray-500 py-12">
            加载中...
          </div>
        ) : topicStats.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">还没有任何主题</p>
            <Button
              variant="link"
              onClick={() => setShowCreateModal(true)}
            >
              创建第一个主题
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topicStats.map(({ topic, count }) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                count={count}
                onClick={() => navigate(`/topics/${topic.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <CreateTopicModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={() => {
          setShowCreateModal(false)
          loadTopicStats()
        }}
      />
    </div>
  )
}
