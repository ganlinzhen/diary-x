import { Plan } from '../../types/diary'
import { FileText, Calendar } from 'lucide-react'
import { Card, CardHeader, CardContent } from '../ui/card'

interface PlanCardProps {
  plan: Plan
  count: number
  onClick: () => void
}

export default function PlanCard({ plan, count, onClick }: PlanCardProps) {
  const formatDateRange = () => {
    if (!plan.startDate && !plan.endDate) return null
    if (plan.startDate && plan.endDate) {
      return `${plan.startDate} 至 ${plan.endDate}`
    }
    if (plan.startDate) return `开始: ${plan.startDate}`
    if (plan.endDate) return `结束: ${plan.endDate}`
    return null
  }

  const dateRange = formatDateRange()

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: plan.color + '20' }}
          >
            <span className="text-2xl" style={{ color: plan.color }}>
              {plan.icon || '🎯'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FileText className="w-4 h-4" />
            <span>{count} 个段落</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{plan.name}</h3>

        {dateRange && (
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Calendar className="w-3 h-3" />
            <span>{dateRange}</span>
          </div>
        )}

        {plan.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{plan.description}</p>
        )}
      </CardContent>
    </Card>
  )
}
