"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/bottom-nav"
import { PriceChart } from "@/components/price-chart"
import { NegativePriceBanner } from "@/components/negative-price-banner"
import { TrendingDown, TrendingUp, Battery, Car, Zap, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import useSWR from "swr"
import type { PriceData, DailySummary } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function DashboardPage() {
  const [currentTime] = useState(new Date())
  const { data: priceData } = useSWR<{ region: string; date: string; prices: PriceData[] }>("/api/prices", fetcher, {
    refreshInterval: 60000,
  })
  const { data: summary } = useSWR<DailySummary>("/api/summary", fetcher, {
    refreshInterval: 30000,
  })

  const currentPrice = priceData?.prices.find((p) => {
    const priceTime = new Date(p.timestamp)
    return (
      priceTime.getHours() === currentTime.getHours() &&
      Math.floor(priceTime.getMinutes() / 30) === Math.floor(currentTime.getMinutes() / 30)
    )
  })

  const hasNegativePrice = currentPrice?.isNegative || false

  const handleOptimizeNow = async () => {
    // Optimistic UI update
    await fetch("/api/strategy/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        intervals: [],
        devices: [],
      }),
    })
  }

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-lg border-b border-border">
          <div className="max-w-screen-lg mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
              <Button onClick={handleOptimizeNow} size="sm" className="gap-2">
                <Zap className="w-4 h-4" />
                Optimize Now
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-6">
          {/* Negative Price Banner */}
          {hasNegativePrice && <NegativePriceBanner price={currentPrice.price} />}

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Today Cost</span>
                </div>
                <div className="text-2xl font-bold tabular-nums">€{summary?.estimatedCost.toFixed(2) || "0.00"}</div>
                <p className="text-xs text-muted-foreground mt-1">Estimated</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Grid Income</span>
                </div>
                <div className="text-2xl font-bold tabular-nums">€{summary?.gridExportIncome.toFixed(2) || "0.00"}</div>
                <p className="text-xs text-muted-foreground mt-1">Export earnings</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Battery className="w-4 h-4 text-warning" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Battery SOC</span>
                </div>
                <div className="text-2xl font-bold tabular-nums">{summary?.batterySoc || 0}%</div>
                <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                  <div
                    className="bg-warning h-1.5 rounded-full transition-all"
                    style={{ width: `${summary?.batterySoc || 0}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Car className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">EV Charge</span>
                </div>
                <div className="text-2xl font-bold tabular-nums">{summary?.evSoc || 0}%</div>
                <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${summary?.evSoc || 0}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gamification Card */}
          {summary && summary.userPercentile > 0 && (
            <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-success/10 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Your Ranking</p>
                    <p className="text-lg font-bold text-balance">
                      You beat {summary.userPercentile}% of users in Belval today
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Price Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Day-Ahead Prices</span>
                {currentPrice && (
                  <span
                    className={cn(
                      "text-lg font-bold tabular-nums",
                      currentPrice.isNegative
                        ? "text-success"
                        : currentPrice.isPeak
                          ? "text-destructive"
                          : "text-foreground",
                    )}
                  >
                    {currentPrice.price > 0 ? "€" : ""}
                    {currentPrice.price.toFixed(2)}
                    {currentPrice.price > 0 ? "/MWh" : " €/MWh"}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {priceData?.prices ? (
                <PriceChart prices={priceData.prices} />
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-pulse text-muted-foreground">Loading prices...</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Price Info */}
          {currentPrice && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Period</p>
                    <p className="text-lg font-semibold">
                      {new Date(currentPrice.timestamp).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(new Date(currentPrice.timestamp).getTime() + 30 * 60000).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <span
                      className={cn(
                        "text-xs px-3 py-1.5 rounded-full font-medium",
                        currentPrice.isNegative
                          ? "bg-success/10 text-success"
                          : currentPrice.isPeak
                            ? "bg-destructive/10 text-destructive"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {currentPrice.isNegative ? "Get Paid to Charge" : currentPrice.isPeak ? "Peak Price" : "Normal"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <BottomNav />
    </>
  )
}
