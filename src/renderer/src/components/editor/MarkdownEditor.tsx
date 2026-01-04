import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Eye, Edit3 } from 'lucide-react'
import clsx from 'clsx'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview' | 'split'>('split')

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('edit')}
            className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors',
              mode === 'edit'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <Edit3 className="w-4 h-4" />
            <span className="text-sm">编辑</span>
          </button>
          <button
            onClick={() => setMode('split')}
            className={clsx(
              'px-3 py-1.5 rounded-md transition-colors text-sm',
              mode === 'split'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            分屏
          </button>
          <button
            onClick={() => setMode('preview')}
            className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors',
              mode === 'preview'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm">预览</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        {(mode === 'edit' || mode === 'split') && (
          <div className={clsx('flex-1 overflow-auto', mode === 'split' && 'border-r border-gray-200')}>
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="开始写日记..."
              className="w-full h-full p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed"
            />
          </div>
        )}

        {/* Preview */}
        {(mode === 'preview' || mode === 'split') && (
          <div className="flex-1 overflow-auto p-6">
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {value || '*暂无内容*'}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
