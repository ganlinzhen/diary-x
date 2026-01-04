import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Plan } from '../../types/diary'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'

interface PlanSelectorProps {
  selectedPlanIds: string[]
  plans: Plan[]
  onChange: (planIds: string[]) => void
}

export default function PlanSelector({ selectedPlanIds, plans, onChange }: PlanSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedPlans = plans.filter((p) => selectedPlanIds.includes(p.id))
  const availablePlans = plans.filter((p) => !selectedPlanIds.includes(p.id))

  const handleToggle = (planId: string) => {
    if (selectedPlanIds.includes(planId)) {
      onChange(selectedPlanIds.filter((id) => id !== planId))
    } else {
      onChange([...selectedPlanIds, planId])
    }
  }

  const handleRemove = (planId: string) => {
    onChange(selectedPlanIds.filter((id) => id !== planId))
  }

  return (
    <div className="space-y-2">
      {/* Selected Plans */}
      <div className="flex flex-wrap gap-2">
        {selectedPlans.map((plan) => (
          <span
            key={plan.id}
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
            style={{
              backgroundColor: plan.color + '20',
              color: plan.color
            }}
          >
            {plan.icon || '🎯'} {plan.name}
            <button
              onClick={() => handleRemove(plan.id)}
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
              添加计划
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="start">
            {availablePlans.length === 0 ? (
              <p className="text-xs text-gray-500 p-2 text-center">没有更多计划了</p>
            ) : (
              <div className="space-y-1 max-h-64 overflow-auto">
                {availablePlans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => {
                      handleToggle(plan.id)
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded text-left transition-colors"
                  >
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: plan.color }}
                    />
                    <span className="text-sm text-gray-700 flex-1">
                      {plan.icon || '🎯'} {plan.name}
                    </span>
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
