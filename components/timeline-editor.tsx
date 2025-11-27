"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Battery, TrendingUp, Sun, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import type { StrategyInterval } from "@/lib/types"

interface TimelineEditorProps {
  intervals: StrategyInterval[]
  onChange: (intervals: StrategyInterval[]) => void
}

const timeSlots = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2)
  const minute = (i % 2) * 30
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
})

const actions = [
  { value: "charge_from_grid", label: "Charge from Grid", icon: Battery, color: "bg-primary" },
  { value: "discharge_to_grid", label: "Discharge to Grid", icon: TrendingUp, color: "bg-warning" },
  { value: "self_consumption", label: "Self Consumption", icon: Sun, color: "bg-success" },
  { value: "idle", label: "Idle", icon: Zap, color: "bg-muted" },
] as const

export function TimelineEditor({ intervals, onChange }: TimelineEditorProps) {
  const [selectedAction, setSelectedAction] = useState<StrategyInterval["action"]>("charge_from_grid")
  const [dragStart, setDragStart] = useState<number | null>(null)
  const [dragEnd, setDragEnd] = useState<number | null>(null)

  const handleSlotMouseDown = (index: number) => {
    setDragStart(index)
    setDragEnd(index)
  }

  const handleSlotMouseEnter = (index: number) => {
    if (dragStart !== null) {
      setDragEnd(index)
    }
  }

  const handleSlotMouseUp = () => {
    if (dragStart !== null && dragEnd !== null) {
      const start = Math.min(dragStart, dragEnd)
      const end = Math.max(dragStart, dragEnd)

      const newInterval: StrategyInterval = {
        start: timeSlots[start],
        end: timeSlots[Math.min(end + 1, 47)],
        action: selectedAction,
      }

      onChange([...intervals, newInterval])
    }
    setDragStart(null)
    setDragEnd(null)
  }

  const isSlotSelected = (index: number) => {
    if (dragStart === null || dragEnd === null) return false
    const start = Math.min(dragStart, dragEnd)
    const end = Math.max(dragStart, dragEnd)
    return index >= start && index <= end
  }

  const getSlotColor = (slot: string) => {
    const matchingInterval = intervals.find((interval) => slot >= interval.start && slot < interval.end)
    if (!matchingInterval) return ""

    const action = actions.find((a) => a.value === matchingInterval.action)
    return action?.color || ""
  }

  return (
    <div className="space-y-4">
      {/* Action Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Action</label>
        <Select value={selectedAction} onValueChange={(v) => setSelectedAction(v as typeof selectedAction)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {actions.map((action) => {
              const Icon = action.icon
              return (
                <SelectItem key={action.value} value={action.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Timeline Grid */}
      <div className="border border-border rounded-lg p-4 bg-card">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium">00:00</span>
          <span className="text-sm font-medium">12:00</span>
          <span className="text-sm font-medium">23:30</span>
        </div>
        <div className="grid grid-cols-24 gap-0.5" onMouseUp={handleSlotMouseUp} onMouseLeave={handleSlotMouseUp}>
          {timeSlots.map((slot, index) => (
            <div
              key={slot}
              className={cn(
                "h-12 cursor-pointer border border-border transition-all",
                isSlotSelected(index) && "ring-2 ring-primary",
                getSlotColor(slot),
              )}
              onMouseDown={() => handleSlotMouseDown(index)}
              onMouseEnter={() => handleSlotMouseEnter(index)}
              title={slot}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center gap-4 flex-wrap">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <div key={action.value} className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded", action.color)} />
                <span className="text-xs text-muted-foreground">{action.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="p-3 rounded-lg bg-muted/50 border border-dashed border-border">
        <p className="text-xs text-muted-foreground text-center">
          Click and drag across time slots to create intervals, then they will appear in the schedule below
        </p>
      </div>
    </div>
  )
}
