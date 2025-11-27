"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/bottom-nav"
import { TimelineEditor } from "@/components/timeline-editor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Zap, Sun, Battery, TrendingUp, Save, RotateCcw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { StrategyInterval } from "@/lib/types"

export default function StrategyPage() {
  const [activePreset, setActivePreset] = useState<"smartshift" | "eco" | "peak-avoid" | "custom">("smartshift")
  const [intervals, setIntervals] = useState<StrategyInterval[]>([])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [estimatedSavings, setEstimatedSavings] = useState<number | null>(null)
  const [isApplying, setIsApplying] = useState(false)

  const handleApplyStrategy = async () => {
    setIsApplying(true)
    try {
      const response = await fetch("/api/strategy/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intervals,
          devices: ["ev-1", "battery-1", "ppa-1"],
        }),
      })
      const data = await response.json()
      setEstimatedSavings(data.estimatedSavings)
      setShowConfirmDialog(true)
    } catch (error) {
      console.error("[v0] Strategy apply failed:", error)
    } finally {
      setIsApplying(false)
    }
  }

  const handlePresetSelect = (preset: typeof activePreset) => {
    setActivePreset(preset)

    // Generate preset intervals
    const presetIntervals: Record<typeof activePreset, StrategyInterval[]> = {
      smartshift: [
        { start: "02:00", end: "06:00", action: "charge_from_grid" },
        { start: "06:00", end: "17:00", action: "self_consumption" },
        { start: "17:00", end: "21:00", action: "discharge_to_grid" },
        { start: "21:00", end: "02:00", action: "idle" },
      ],
      eco: [{ start: "00:00", end: "24:00", action: "self_consumption" }],
      "peak-avoid": [
        { start: "00:00", end: "17:00", action: "charge_from_grid" },
        { start: "17:00", end: "21:00", action: "discharge_to_grid" },
        { start: "21:00", end: "24:00", action: "idle" },
      ],
      custom: [],
    }

    setIntervals(presetIntervals[preset])
  }

  const handleReset = () => {
    setIntervals([])
    setActivePreset("custom")
  }

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-lg border-b border-border">
          <div className="max-w-screen-lg mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Strategy Editor</h1>
                <p className="text-sm text-muted-foreground">Optimize your energy usage</p>
              </div>
              <Button onClick={handleReset} size="sm" variant="outline" className="gap-2 bg-transparent">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-6">
          {/* Strategy Presets */}
          <Card>
            <CardHeader>
              <CardTitle>Strategy Presets</CardTitle>
              <CardDescription>Choose a preset or create your own custom strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activePreset} onValueChange={(v) => handlePresetSelect(v as typeof activePreset)}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="smartshift">SmartShift</TabsTrigger>
                  <TabsTrigger value="eco">ECO</TabsTrigger>
                  <TabsTrigger value="peak-avoid">Peak Avoid</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>

                <TabsContent value="smartshift" className="space-y-3 mt-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">SmartShift AI Strategy</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        AI-powered optimization that charges during low prices and discharges during peak hours for
                        maximum savings.
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          Best Savings
                        </Badge>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          Recommended
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="eco" className="space-y-3 mt-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-success/5 border border-success/20">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Sun className="w-5 h-5 text-success" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">ECO Mode</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Prioritizes renewable energy and self-consumption. Minimizes grid interaction and reduces carbon
                        footprint.
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          Low Carbon
                        </Badge>
                        <Badge variant="outline" className="bg-muted text-muted-foreground">
                          Self Sufficient
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="peak-avoid" className="space-y-3 mt-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/20">
                    <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-warning" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Peak Shaving</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Maximizes grid arbitrage by discharging to grid during peak hours. Best for earning from high
                        export prices.
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                          High Revenue
                        </Badge>
                        <Badge variant="outline" className="bg-muted text-muted-foreground">
                          Grid Export
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="custom" className="space-y-3 mt-4">
                  <div className="p-3 rounded-lg bg-muted/50 border border-dashed border-border">
                    <p className="text-sm text-muted-foreground text-center">
                      Use the timeline editor below to create your own custom strategy
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Timeline Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline Editor</CardTitle>
              <CardDescription>Click and drag to select time ranges, then choose an action</CardDescription>
            </CardHeader>
            <CardContent>
              <TimelineEditor intervals={intervals} onChange={setIntervals} />
            </CardContent>
          </Card>

          {/* Current Schedule */}
          {intervals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Schedule Overview</CardTitle>
                <CardDescription>Review your strategy for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {intervals.map((interval, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          {interval.action === "charge_from_grid" && <Battery className="w-4 h-4 text-primary" />}
                          {interval.action === "discharge_to_grid" && <TrendingUp className="w-4 h-4 text-warning" />}
                          {interval.action === "self_consumption" && <Sun className="w-4 h-4 text-success" />}
                          {interval.action === "idle" && <Zap className="w-4 h-4 text-muted-foreground" />}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{interval.action.replace(/_/g, " ")}</p>
                          <p className="text-sm text-muted-foreground">
                            {interval.start} - {interval.end}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIntervals(intervals.filter((_, i) => i !== index))}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Apply Button */}
          <Button
            onClick={handleApplyStrategy}
            disabled={intervals.length === 0 || isApplying}
            className="w-full gap-2"
            size="lg"
          >
            <Save className="w-5 h-5" />
            {isApplying ? "Applying Strategy..." : "Apply Strategy"}
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Strategy Applied Successfully</DialogTitle>
            <DialogDescription>Your energy optimization strategy has been activated</DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Estimated Savings</h3>
              <p className="text-4xl font-bold text-success mb-2">€{estimatedSavings?.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Expected savings for today based on current prices</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowConfirmDialog(false)} className="w-full">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </>
  )
}
