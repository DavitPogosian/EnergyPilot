"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BottomNav } from "@/components/bottom-nav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingDown, TrendingUp, Leaf, Download, Award, Calendar, Euro, Zap } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const dailyCostData = [
  { day: "Mon", cost: 8.5, income: 2.1 },
  { day: "Tue", cost: 12.3, income: 3.5 },
  { day: "Wed", cost: 6.8, income: 4.2 },
  { day: "Thu", cost: 15.2, income: 1.8 },
  { day: "Fri", cost: 9.7, income: 3.9 },
  { day: "Sat", cost: 7.4, income: 5.1 },
  { day: "Sun", cost: 11.2, income: 2.7 },
]

const weeklySavingsData = [
  { week: "W1", savings: 45 },
  { week: "W2", savings: 52 },
  { week: "W3", savings: 38 },
  { week: "W4", savings: 67 },
]

export default function InsightsPage() {
  const handleExportCSV = () => {
    console.log("[v0] Exporting CSV data")
  }

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-lg border-b border-border">
          <div className="max-w-screen-lg mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Insights</h1>
                <p className="text-sm text-muted-foreground">Track your energy performance</p>
              </div>
              <Button onClick={handleExportCSV} size="sm" variant="outline" className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                    <Euro className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Week Savings</span>
                </div>
                <div className="text-2xl font-bold tabular-nums">€67.20</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-success" />
                  <span className="text-xs text-success">+12% vs last week</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Energy Used</span>
                </div>
                <div className="text-2xl font-bold tabular-nums">342 kWh</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3 text-success" />
                  <span className="text-xs text-success">-8% vs last week</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">CO₂ Avoided</span>
                </div>
                <div className="text-2xl font-bold tabular-nums">28.5 kg</div>
                <p className="text-xs text-muted-foreground mt-1">This week</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-warning" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Streak</span>
                </div>
                <div className="text-2xl font-bold tabular-nums">14 days</div>
                <p className="text-xs text-muted-foreground mt-1">Using SmartShift</p>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard Card */}
          <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-success/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Community Ranking</p>
                  <p className="text-lg font-bold text-balance mb-1">Top 15% in Belval this month</p>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    Elite Saver
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <Tabs defaultValue="daily" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
            </TabsList>

            <TabsContent value="daily">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Cost vs Income</CardTitle>
                  <CardDescription>Your energy costs and grid export income this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={dailyCostData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis
                        dataKey="day"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `€${value}`}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                                <div className="flex flex-col gap-2">
                                  <span className="text-xs font-medium text-muted-foreground">
                                    {payload[0].payload.day}
                                  </span>
                                  <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm text-destructive">Cost:</span>
                                    <span className="font-bold">€{payload[0].value}</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm text-success">Income:</span>
                                    <span className="font-bold">€{payload[1].value}</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-4 pt-2 border-t">
                                    <span className="text-sm font-medium">Net:</span>
                                    <span className="font-bold">
                                      €{((payload[1].value as number) - (payload[0].value as number)).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="cost" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="income" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="weekly">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Savings Trend</CardTitle>
                  <CardDescription>Your total savings over the past 4 weeks</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={weeklySavingsData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis
                        dataKey="week"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `€${value}`}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                                <div className="flex flex-col gap-1">
                                  <span className="text-xs font-medium text-muted-foreground">
                                    {payload[0].payload.week}
                                  </span>
                                  <span className="text-lg font-bold text-success">€{payload[0].value}</span>
                                  <span className="text-xs text-muted-foreground">Total savings</span>
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="savings"
                        stroke="hsl(var(--success))"
                        strokeWidth={2}
                        fill="url(#savingsGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <BottomNav />
    </>
  )
}
