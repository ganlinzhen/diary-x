import { NavLink } from 'react-router-dom'
import { BookOpen, Tags } from 'lucide-react'
import clsx from 'clsx'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Diary-X</h1>
        <p className="text-sm text-gray-500 mt-1">我的主题日记</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          to="/diary"
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100'
            )
          }
        >
          <BookOpen className="w-5 h-5" />
          <span className="font-medium">日记</span>
        </NavLink>

        <NavLink
          to="/topics"
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100'
            )
          }
        >
          <Tags className="w-5 h-5" />
          <span className="font-medium">主题</span>
        </NavLink>
        <NavLink
          to="/topics"
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100'
            )
          }
        >
          <Tags className="w-5 h-5" />
          <span className="font-medium">计划</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Powered by Electron + React
        </p>
      </div>
    </aside>
  )
}
