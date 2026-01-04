import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { useAnniversaryStore } from '../../stores/anniversaryStore'
import { Anniversary } from '../../types/diary'

interface CreateAnniversaryModalProps {
  open: boolean
  onClose: () => void
  editAnniversary?: Anniversary | null
}

const PRESET_COLORS = [
  '#EF4444', // red
  '#F97316', // orange
  '#F59E0B', // amber
  '#10B981', // emerald
  '#14B8A6', // teal
  '#06B6D4', // cyan
  '#3B82F6', // blue
  '#6366F1', // indigo
  '#8B5CF6', // violet
  '#EC4899'  // pink
]

const PRESET_ICONS = ['🎂', '💝', '💐', '🎁', '🎉', '❤️', '🌹', '💍', '🎊', '🌟']

export default function CreateAnniversaryModal({
  open,
  onClose,
  editAnniversary
}: CreateAnniversaryModalProps) {
  const { createAnniversary, updateAnniversary } = useAnniversaryStore()

  const [person, setPerson] = useState(editAnniversary?.person || '')
  const [eventType, setEventType] = useState(editAnniversary?.eventType || '')
  const [date, setDate] = useState(editAnniversary?.date || '')
  const [startYear, setStartYear] = useState(editAnniversary?.startYear?.toString() || '')
  const [description, setDescription] = useState(editAnniversary?.description || '')
  const [color, setColor] = useState(editAnniversary?.color || PRESET_COLORS[0])
  const [icon, setIcon] = useState(editAnniversary?.icon || PRESET_ICONS[0])
  const [yearlyRepeat, setYearlyRepeat] = useState(editAnniversary?.yearlyRepeat ?? true)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!person.trim() || !eventType.trim() || !date.trim()) return

    setLoading(true)
    try {
      const anniversaryData = {
        person: person.trim(),
        eventType: eventType.trim(),
        date: date.trim(),
        description: description.trim() || undefined,
        color,
        icon,
        yearlyRepeat,
        startYear: startYear ? parseInt(startYear) : undefined
      }

      if (editAnniversary) {
        await updateAnniversary(editAnniversary.id, anniversaryData)
      } else {
        await createAnniversary(anniversaryData)
      }

      handleClose()
    } catch (error) {
      console.error('Failed to save anniversary:', error)
      alert('保存失败: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setPerson('')
    setEventType('')
    setDate('')
    setStartYear('')
    setDescription('')
    setColor(PRESET_COLORS[0])
    setIcon(PRESET_ICONS[0])
    setYearlyRepeat(true)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editAnniversary ? '编辑纪念日' : '新建纪念日'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                人物 *
              </label>
              <input
                type="text"
                value={person}
                onChange={(e) => setPerson(e.target.value)}
                placeholder="例如：老婆"
                className="flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                事件类型 *
              </label>
              <input
                type="text"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                placeholder="例如：生日"
                className="flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                日期 (MM-DD) *
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="例如：03-01"
                pattern="\d{2}-\d{2}"
                className="flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
                required
              />
              <p className="text-xs text-gray-500">格式：月-日，例如 03-01</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                开始年份（可选）
              </label>
              <input
                type="text"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                placeholder="例如：2020"
                pattern="\d{4}"
                className="flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950"
              />
              <p className="text-xs text-gray-500">用于计算纪念年数</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              备注
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="添加一些备注信息..."
              rows={3}
              className="flex min-h-[60px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              颜色
            </label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    color === c ? 'border-gray-900 scale-110' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              图标
            </label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  className={`w-10 h-10 text-2xl rounded-lg border-2 transition-all ${
                    icon === i ? 'border-gray-900 scale-110' : 'border-gray-200'
                  }`}
                  onClick={() => setIcon(i)}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="yearlyRepeat"
              checked={yearlyRepeat}
              onChange={(e) => setYearlyRepeat(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="yearlyRepeat" className="text-sm font-medium leading-none cursor-pointer">
              每年重复
            </label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '保存中...' : editAnniversary ? '保存' : '创建'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
