"use client"

import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import type { PriceData } from "@/lib/types"

interface PriceChartProps {
  prices: PriceData[]
}

export function PriceChart({ prices }: PriceChartProps) {
  const chartData = useMemo(() => {
    return prices.map((price) => ({
      time: new Date(price.timestamp).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      price: price.price,
      isNegative: price.isNegative,
      isPeak: price.isPeak,
    }))
  }, [prices])

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
        <XAxis
          dataKey="time"
          stroke="hsl(var(--muted-foreground))"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          minTickGap={40}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `€${value}`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload
              return (
                <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-muted-foreground">{data.time}</span>
                    <span className="text-lg font-bold tabular-nums">€{Number(data.price).toFixed(2)}/MWh</span>
                    {data.isNegative && <span className="text-xs text-success font-medium">Get paid to charge!</span>}
                    {data.isPeak && <span className="text-xs text-destructive font-medium">Peak pricing</span>}
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <ReferenceLine y={0} stroke="hsl(var(--border))" strokeWidth={2} />
        <Area
          type="monotone"
          dataKey="price"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          fill="url(#priceGradient)"
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
