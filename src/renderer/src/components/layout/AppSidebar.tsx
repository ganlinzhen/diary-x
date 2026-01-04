import { useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, Tags, Target, Calendar, Sparkles, Heart, Home } from 'lucide-react'

const menuItems = [
  {
    title: '首页',
    icon: Home,
    path: '/dashboard',
  },
  {
    title: '日记',
    icon: BookOpen,
    path: '/diary',
  },
  {
    title: '主题',
    icon: Tags,
    path: '/topics',
  },
  {
    title: '计划',
    icon: Target,
    path: '/plans',
  },
  {
    title: '纪念日',
    icon: Heart,
    path: '/anniversaries',
  },
]

export default function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3 p-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-base text-gray-900 truncate">Diary-X</div>
            <div className="text-xs text-gray-500 truncate">我的主题日记</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-1">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            应用导航
          </div>
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
            const Icon = item.icon

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.title}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span>
            {new Date().toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>
    </aside>
  )
}
