"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Battery, TrendingUp, Sun, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import type { StrategyInterval } from "@/lib/types"

interface TimelineEditorProps {
  intervals: StrategyInterval[]
  onChange: (intervals: StrategyInterval[]) => void
  readOnly?: boolean
}

const timeSlots = Array.from({ length: 96 }, (_, i) => {
  const hour = Math.floor(i / 4)
  const minute = (i % 4) * 15
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
})

const actions = [
  { value: "charge_from_grid", label: "Charge from Grid", icon: Battery, color: "bg-red-500" },
  { value: "discharge_to_grid", label: "Discharge to Grid", icon: TrendingUp, color: "bg-green-500" },
  { value: "self_consumption", label: "Self Consumption", icon: Sun, color: "bg-blue-500" },
  { value: "idle", label: "Idle", icon: Zap, color: "bg-orange-500" },
] as const

export function TimelineEditor({ intervals, onChange, readOnly = false }: TimelineEditorProps) {
  const [selectedAction, setSelectedAction] = useState<StrategyInterval["action"]>("charge_from_grid")
  const [dragStart, setDragStart] = useState<number | null>(null)
  const [dragEnd, setDragEnd] = useState<number | null>(null)

  const handleSlotMouseDown = (index: number) => {
    if (readOnly) return
    setDragStart(index)
    setDragEnd(index)
  }

  const handleSlotMouseEnter = (index: number) => {
    if (readOnly) return
    if (dragStart !== null) {
      setDragEnd(index)
    }
  }

  const handleSlotMouseUp = () => {
    if (readOnly) return
    if (dragStart !== null && dragEnd !== null) {
      const start = Math.min(dragStart, dragEnd)
      const end = Math.max(dragStart, dragEnd)

      const newInterval: StrategyInterval = {
        start: timeSlots[start],
        end: timeSlots[Math.min(end + 1, 95)],
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
      {!readOnly && (
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
      )}

      {/* Timeline Grid */}
      <div className="border border-border rounded-lg p-4 bg-card">
        <div className="mb-3 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col justify-between text-[10px] text-muted-foreground py-0.5">
            <span>00</span>
            <span>15</span>
            <span>30</span>
            <span>45</span>
          </div>
          <div
            className={cn("grid grid-cols-24 gap-0.5 flex-1", readOnly && "opacity-60")}
            onMouseUp={handleSlotMouseUp}
            onMouseLeave={handleSlotMouseUp}
          >
            {timeSlots.map((slot, index) => (
              <div
                key={slot}
                className={cn(
                  "h-8 border border-border transition-all",
                  !readOnly && "cursor-pointer",
                  isSlotSelected(index) && !readOnly && "ring-2 ring-primary",
                  getSlotColor(slot),
                )}
                onMouseDown={() => handleSlotMouseDown(index)}
                onMouseEnter={() => handleSlotMouseEnter(index)}
                title={slot}
              />
            ))}
          </div>
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
          {readOnly
            ? "This timeline is view-only. Switch to Custom strategy to edit the schedule."
            : "Click and drag across time slots to create intervals, then they will appear in the schedule below"}
        </p>
      </div>
    </div>
  )
}
