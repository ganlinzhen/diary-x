import { useEffect, useState } from 'react'
import { useAnniversaryStore } from '../stores/anniversaryStore'
import { Button } from '../components/ui/button'
import { Plus } from 'lucide-react'
import AnniversaryCard from '../components/anniversary/AnniversaryCard'
import CreateAnniversaryModal from '../components/anniversary/CreateAnniversaryModal'
import { Anniversary } from '../types/diary'

export default function AnniversaryList() {
  const { anniversaries, upcomingAnniversaries, loadAnniversaries, loadUpcomingAnniversaries, deleteAnniversary } = useAnniversaryStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAnniversary, setEditingAnniversary] = useState<Anniversary | null>(null)

  useEffect(() => {
    loadAnniversaries()
    loadUpcomingAnniversaries(30) // Load upcoming anniversaries for the next 30 days
  }, [loadAnniversaries, loadUpcomingAnniversaries])

  const handleEdit = (anniversary: Anniversary) => {
    setEditingAnniversary(anniversary)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除这个纪念日吗？')) {
      try {
        await deleteAnniversary(id)
        // Reload after deletion
        await loadAnniversaries()
        await loadUpcomingAnniversaries(30)
      } catch (error) {
        console.error('Failed to delete anniversary:', error)
        alert('删除失败: ' + (error as Error).message)
      }
    }
  }

  const handleModalClose = async () => {
    setModalOpen(false)
    setEditingAnniversary(null)
    // Reload data after modal closes
    await loadAnniversaries()
    await loadUpcomingAnniversaries(30)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">纪念日</h1>
          <p className="text-gray-500 mt-1">记录重要的日子</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          新建纪念日
        </Button>
      </div>

      {/* Upcoming Anniversaries */}
      {upcomingAnniversaries.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">即将到来 (30天内)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingAnniversaries.map((anniversary) => (
              <div key={anniversary.id} className="relative group">
                <AnniversaryCard
                  anniversary={anniversary}
                  onClick={() => handleEdit(anniversary)}
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(anniversary.id)
                    }}
                  >
                    删除
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Anniversaries */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">全部纪念日</h2>
        {anniversaries.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">还没有任何纪念日</p>
            <p className="text-sm">点击右上角按钮创建第一个纪念日吧</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {anniversaries.map((anniversary) => (
              <div key={anniversary.id} className="relative group">
                <AnniversaryCard
                  anniversary={anniversary}
                  onClick={() => handleEdit(anniversary)}
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(anniversary.id)
                    }}
                  >
                    删除
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <CreateAnniversaryModal
        open={modalOpen}
        onClose={handleModalClose}
        editAnniversary={editingAnniversary}
      />
    </div>
  )
}
