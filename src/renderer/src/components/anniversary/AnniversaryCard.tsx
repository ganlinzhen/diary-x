import { Anniversary } from '../../types/diary'
import { Calendar, Clock } from 'lucide-react'
import { Card, CardHeader, CardContent } from '../ui/card'

interface AnniversaryCardProps {
  anniversary: Anniversary
  onClick: () => void
}

function calculateDaysUntil(dateString: string, startYear?: number): { days: number; years?: number } {
  const [month, day] = dateString.split('-').map(Number)
  const today = new Date()
  const thisYearDate = new Date(today.getFullYear(), month - 1, day)
  const nextYearDate = new Date(today.getFullYear() + 1, month - 1, day)

  let targetDate = thisYearDate
  if (thisYearDate < today) {
    targetDate = nextYearDate
  }

  const days = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  const years = startYear ? today.getFullYear() - startYear : undefined

  return { days, years }
}

export default function AnniversaryCard({ anniversary, onClick }: AnniversaryCardProps) {
  const { days, years } = calculateDaysUntil(anniversary.date, anniversary.startYear)

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: anniversary.color + '20' }}
          >
            <span className="text-2xl" style={{ color: anniversary.color }}>
              {anniversary.icon || '🎂'}
            </span>
          </div>

          <div className="text-right">
            {days === 0 ? (
              <span className="text-sm font-semibold text-red-500">今天！</span>
            ) : days <= 7 ? (
              <div className="flex items-center gap-1 text-sm text-orange-500">
                <Clock className="w-4 h-4" />
                <span>{days} 天后</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{days} 天后</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{anniversary.person}</h3>
            <p className="text-sm text-gray-600">{anniversary.eventType}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{anniversary.date.replace('-', ' 月 ')} 日</span>
            {years !== undefined && (
              <span className="text-blue-600 font-medium">· 第 {years} 年</span>
            )}
          </div>

          {anniversary.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mt-2">{anniversary.description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
