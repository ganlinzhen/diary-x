import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { usePlanStore } from '../stores/planStore'
import { Button } from '../components/ui/button'
import PlanCard from '../components/plan/PlanCard'
import CreatePlanModal from '../components/plan/CreatePlanModal'

export default function PlanList() {
  const navigate = useNavigate()
  const { planStats, loading, loadPlanStats } = usePlanStore()
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    loadPlanStats()
  }, [])

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">计划管理</h1>
            <p className="text-sm text-gray-500 mt-1">查看和管理你的计划目标</p>
          </div>

          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            新建计划
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="text-center text-gray-500 py-12">
            加载中...
          </div>
        ) : planStats.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">还没有任何计划</p>
            <Button
              variant="link"
              onClick={() => setShowCreateModal(true)}
            >
              创建第一个计划
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {planStats.map(({ plan, count }) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                count={count}
                onClick={() => navigate(`/plans/${plan.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <CreatePlanModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={() => {
          setShowCreateModal(false)
          loadPlanStats()
        }}
      />
    </div>
  )
}
