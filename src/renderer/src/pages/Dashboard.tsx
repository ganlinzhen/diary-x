import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Calendar, Clock, Sun, Cloud, BookOpen, Heart, Target } from 'lucide-react'
import { usePlanStore } from '../stores/planStore'
import { useAnniversaryStore } from '../stores/anniversaryStore'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const { plans, loadPlans } = usePlanStore()
  const { upcomingAnniversaries, loadUpcomingAnniversaries } = useAnniversaryStore()

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 加载数据
  useEffect(() => {
    loadPlans()
    loadUpcomingAnniversaries(30)
  }, [loadPlans, loadUpcomingAnniversaries])

  // 获取进行中的计划
  const activePlans = plans.filter(plan => plan.status === 'in_progress').slice(0, 5)

  // 获取即将到来的纪念日（7天内）
  const urgentAnniversaries = upcomingAnniversaries.slice(0, 5)

  // 格式化日期
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  // 获取农历日期（简化版）
  const getLunarDate = () => {
    // 这里暂时返回一个占位符，后续可以集成真实的农历API
    return '甲辰龙年 腊月初五'
  }

  // 获取今日宜忌（简化版）
  const getTodayLuck = () => {
    // 这里暂时返回占位符，后续可以集成黄历API
    return {
      suitable: ['出行', '开市', '交易', '纳财'],
      unsuitable: ['嫁娶', '安葬', '动土', '开工']
    }
  }

  const luck = getTodayLuck()

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 日期时间卡片 */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{formatDate(currentTime)}</h2>
                  <p className="text-lg text-gray-600 mt-1">{getLunarDate()}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600" />
              <div className="text-4xl font-bold text-blue-600 tabular-nums">
                {formatTime(currentTime)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 黄历信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-orange-500" />
              今日宜忌
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-green-600 mb-2">宜</h4>
              <div className="flex flex-wrap gap-2">
                {luck.suitable.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-red-600 mb-2">忌</h4>
              <div className="flex flex-wrap gap-2">
                {luck.unsuitable.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 天气信息占位 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-500" />
              天气信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Cloud className="w-16 h-16 mx-auto mb-3 text-gray-300" />
              <p>天气信息待接入</p>
              <p className="text-sm mt-1">后续可集成天气API</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 历史上的今天占位 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-500" />
            历史上的今天
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-16 h-16 mx-auto mb-3 text-gray-300" />
            <p>历史事件信息待接入</p>
            <p className="text-sm mt-1">后续可集成历史事件API</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 我的计划 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                进行中的计划
              </CardTitle>
              <button
                onClick={() => navigate('/plans')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                查看全部
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {activePlans.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Target className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                <p>暂无进行中的计划</p>
                <button
                  onClick={() => navigate('/plans')}
                  className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                >
                  创建计划
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activePlans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => navigate(`/plans/${plan.id}`)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: plan.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{plan.name}</h4>
                      {plan.description && (
                        <p className="text-sm text-gray-500 truncate">{plan.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 即将到来的纪念日 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                即将到来的纪念日
              </CardTitle>
              <button
                onClick={() => navigate('/anniversaries')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                查看全部
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {urgentAnniversaries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Heart className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                <p>近期暂无纪念日</p>
                <button
                  onClick={() => navigate('/anniversaries')}
                  className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                >
                  添加纪念日
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {urgentAnniversaries.map((anniversary) => {
                  const calculateDays = () => {
                    const [month, day] = anniversary.date.split('-').map(Number)
                    const today = new Date()
                    const thisYearDate = new Date(today.getFullYear(), month - 1, day)
                    const nextYearDate = new Date(today.getFullYear() + 1, month - 1, day)
                    const targetDate = thisYearDate < today ? nextYearDate : thisYearDate
                    return Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                  }

                  const days = calculateDays()

                  return (
                    <div
                      key={anniversary.id}
                      onClick={() => navigate('/anniversaries')}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: anniversary.color + '20' }}
                      >
                        <span className="text-xl" style={{ color: anniversary.color }}>
                          {anniversary.icon || '🎂'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{anniversary.person}</h4>
                        <p className="text-sm text-gray-500 truncate">{anniversary.eventType}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {days === 0 ? (
                          <span className="text-sm font-semibold text-red-500">今天</span>
                        ) : (
                          <span className="text-sm text-gray-500">{days} 天后</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
