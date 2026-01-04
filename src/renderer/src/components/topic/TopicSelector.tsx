import { useState } from 'react'
import { Plus, X, Check } from 'lucide-react'
import { Topic } from '../../types/diary'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

interface TopicSelectorProps {
  selectedTopicIds: string[]
  topics: Topic[]
  onChange: (topicIds: string[]) => void
}

export default function TopicSelector({ selectedTopicIds, topics, onChange }: TopicSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedTopics = topics.filter((t) => selectedTopicIds.includes(t.id))
  const availableTopics = topics.filter((t) => !selectedTopicIds.includes(t.id))

  const handleToggle = (topicId: string) => {
    if (selectedTopicIds.includes(topicId)) {
      onChange(selectedTopicIds.filter((id) => id !== topicId))
    } else {
      onChange([...selectedTopicIds, topicId])
    }
  }

  const handleRemove = (topicId: string) => {
    onChange(selectedTopicIds.filter((id) => id !== topicId))
  }

  return (
    <div className="space-y-2">
      {/* Selected Topics */}
      <div className="flex flex-wrap gap-2">
        {selectedTopics.map((topic) => (
          <span
            key={topic.id}
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
            style={{
              backgroundColor: topic.color + '20',
              color: topic.color
            }}
          >
            {topic.name}
            <button
              onClick={() => handleRemove(topic.id)}
              className="hover:opacity-70"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-auto px-2 py-1">
              <Plus className="w-3 h-3 mr-1" />
              添加主题
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="start">
            {availableTopics.length === 0 ? (
              <p className="text-xs text-gray-500 p-2 text-center">没有更多主题了</p>
            ) : (
              <div className="space-y-1 max-h-64 overflow-auto">
                {availableTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => {
                      handleToggle(topic.id)
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded text-left transition-colors"
                  >
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: topic.color }}
                    />
                    <span className="text-sm text-gray-700 flex-1">{topic.name}</span>
                  </button>
                ))}
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
