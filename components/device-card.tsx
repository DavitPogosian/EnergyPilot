"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DeviceIcon } from "@/components/device-icon"
import { Play, Zap, ArrowUpCircle, ArrowDownCircle, Home, Power, PowerOff } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DeviceStatus } from "@/lib/types"
import { mutate } from "swr"
import { toast } from "@/hooks/use-toast"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface DeviceCardProps {
  device: DeviceStatus
}

export function DeviceCard({ device }: DeviceCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string>(device.status || "")

  useEffect(() => {
    setSelectedAction(device.status || "")
  }, [device.status])

  const handleAction = async (action: string) => {
    setIsLoading(true)
    setSelectedAction(action)
    try {
      await fetch(`/api/devices/${device.id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      toast({
        title: "Action Completed",
        description: `${device.name} is now ${action.replace(/_/g, " ")}`,
      })
      await mutate("/api/devices")
    } catch (error) {
      console.error("Device action failed:", error)
      toast({
        title: "Action Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
      setSelectedAction(device.status || "")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = () => {
    if (!device.isOnline) {
      return (
        <Badge variant="outline" className="bg-muted text-muted-foreground">
          Offline
        </Badge>
      )
    }

    switch (device.status) {
      case "charging":
        return <Badge className="bg-success text-success-foreground">Charging</Badge>
      case "discharging":
        return <Badge className="bg-warning text-warning-foreground">Discharging</Badge>
      case "auto":
        return <Badge className="bg-primary text-primary-foreground">Auto</Badge>
      default:
        return <Badge variant="outline">Idle</Badge>
    }
  }

  const renderEVActions = () => (
    <div className="grid grid-cols-2 gap-2 mt-4">
      <Button
        onClick={() => handleAction("charge_now")}
        disabled={isLoading || !device.isPlugged}
        size="sm"
        variant={selectedAction === "charge_now" ? "default" : "outline"}
        className={cn("gap-2", selectedAction === "charge_now" && "bg-success hover:bg-success/90 text-white")}
      >
        <Play className="w-4 h-4" />
        Charge
      </Button>
      <Button
        onClick={() => handleAction("auto")}
        disabled={isLoading}
        size="sm"
        variant={selectedAction === "auto" ? "default" : "outline"}
        className={cn("gap-2", selectedAction === "auto" && "bg-success hover:bg-success/90 text-white")}
      >
        <Zap className="w-4 h-4" />
        Auto
      </Button>
    </div>
  )

  const renderBatteryActions = () => (
    <div className="grid grid-cols-2 gap-2 mt-4">
      <Button
        onClick={() => handleAction("charge_from_grid")}
        disabled={isLoading}
        size="sm"
        variant={selectedAction === "charge_from_grid" ? "default" : "outline"}
        className={cn("gap-2", selectedAction === "charge_from_grid" && "bg-success hover:bg-success/90 text-white")}
      >
        <ArrowDownCircle className="w-4 h-4" />
        Charge
      </Button>
      <Button
        onClick={() => handleAction("discharge_to_grid")}
        disabled={isLoading}
        size="sm"
        variant={selectedAction === "discharge_to_grid" ? "default" : "outline"}
        className={cn("gap-2", selectedAction === "discharge_to_grid" && "bg-success hover:bg-success/90 text-white")}
      >
        <ArrowUpCircle className="w-4 h-4" />
        Discharge
      </Button>
      <Button
        onClick={() => handleAction("self_consumption")}
        disabled={isLoading}
        size="sm"
        variant={selectedAction === "self_consumption" ? "default" : "outline"}
        className={cn("gap-2", selectedAction === "self_consumption" && "bg-success hover:bg-success/90 text-white")}
      >
        <Home className="w-4 h-4" />
        Self Use
      </Button>
      <Button
        onClick={() => handleAction("auto")}
        disabled={isLoading}
        size="sm"
        variant={selectedAction === "auto" ? "default" : "outline"}
        className={cn("gap-2", selectedAction === "auto" && "bg-success hover:bg-success/90 text-white")}
      >
        <Zap className="w-4 h-4" />
        Auto
      </Button>
    </div>
  )

  const renderPPAActions = () => (
    <div className="grid grid-cols-3 gap-2 mt-4">
      <Button
        onClick={() => handleAction("turn_on")}
        disabled={isLoading}
        size="sm"
        variant={selectedAction === "turn_on" ? "default" : "outline"}
        className={cn("gap-2", selectedAction === "turn_on" && "bg-success hover:bg-success/90 text-white")}
      >
        <Power className="w-4 h-4" />
        On
      </Button>
      <Button
        onClick={() => handleAction("turn_off")}
        disabled={isLoading}
        size="sm"
        variant={selectedAction === "turn_off" ? "default" : "outline"}
        className={cn("gap-2", selectedAction === "turn_off" && "bg-success hover:bg-success/90 text-white")}
      >
        <PowerOff className="w-4 h-4" />
        Off
      </Button>
      <Button
        onClick={() => handleAction("auto")}
        disabled={isLoading}
        size="sm"
        variant={selectedAction === "auto" ? "default" : "outline"}
        className={cn("gap-2", selectedAction === "auto" && "bg-success hover:bg-success/90 text-white")}
      >
        <Zap className="w-4 h-4" />
        Auto
      </Button>
    </div>
  )

  const solarForecastData = [
    { hour: "00:00", output: 0 },
    { hour: "01:00", output: 0 },
    { hour: "02:00", output: 0 },
    { hour: "03:00", output: 0 },
    { hour: "04:00", output: 0 },
    { hour: "05:00", output: 0 },
    { hour: "06:00", output: 0.2 },
    { hour: "07:00", output: 1.5 },
    { hour: "08:00", output: 3.8 },
    { hour: "09:00", output: 6.2 },
    { hour: "10:00", output: 8.5 },
    { hour: "11:00", output: 10.2 },
    { hour: "12:00", output: 11.8 },
    { hour: "13:00", output: 12.0 },
    { hour: "14:00", output: 11.5 },
    { hour: "15:00", output: 10.0 },
    { hour: "16:00", output: 7.8 },
    { hour: "17:00", output: 5.2 },
    { hour: "18:00", output: 2.8 },
    { hour: "19:00", output: 0.8 },
    { hour: "20:00", output: 0 },
    { hour: "21:00", output: 0 },
    { hour: "22:00", output: 0 },
    { hour: "23:00", output: 0 },
  ]

  return (
    <Card className={cn(!device.isOnline && "opacity-60")}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-4">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
              device.isOnline ? "bg-primary/10" : "bg-muted",
            )}
          >
            <DeviceIcon
              type={device.type}
              className={cn("w-6 h-6", device.isOnline ? "text-primary" : "text-muted-foreground")}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold">{device.name}</h3>
              {getStatusBadge()}
            </div>
            <p className="text-sm text-muted-foreground capitalize">
              {device.type === "ev"
                ? "Electric Vehicle"
                : device.type === "ppa"
                  ? "Photovoltaic"
                  : "Home Battery"}
            </p>
          </div>
        </div>

        {device.type === "ev" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">State of Charge</span>
              <span className="font-semibold tabular-nums">{device.soc}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${device.soc}%` }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Plugged In</span>
              <span className={cn("font-medium", device.isPlugged ? "text-success" : "text-muted-foreground")}>
                {device.isPlugged ? "Yes" : "No"}
              </span>
            </div>
            {device.isCharging && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Charging Rate</span>
                <span className="font-semibold tabular-nums">{device.chargingRate} kW</span>
              </div>
            )}
          </div>
        )}

        {device.type === "battery" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">State of Charge</span>
              <span className="font-semibold tabular-nums">{device.soc}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-warning h-2 rounded-full transition-all" style={{ width: `${device.soc}%` }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Capacity</span>
              <span className="font-semibold tabular-nums">{device.capacity} kWh</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Available</span>
              <span className="font-semibold tabular-nums">
                {(((device.soc || 0) * (device.capacity || 0)) / 100).toFixed(1)} kWh
              </span>
            </div>
          </div>
        )}

        {device.type === "ppa" && (
          <div className="space-y-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Today's Solar Forecast</h4>
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={solarForecastData}>
                    <defs>
                      <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="hour"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      interval={5}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}kW`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <span className="text-xs text-muted-foreground">{payload[0].payload.hour}</span>
                                <span className="text-xs font-bold text-warning">{payload[0].value} kW</span>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="output"
                      stroke="hsl(var(--warning))"
                      fillOpacity={1}
                      fill="url(#solarGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Expected peak: 12.0 kW at 13:00 • Total: 108 kWh
              </p>
            </div>
          </div>
        )}

        {device.isOnline && (
          <>
            {device.type === "ev" && renderEVActions()}
            {device.type === "battery" && renderBatteryActions()}
            {device.type === "ppa" && renderPPAActions()}
          </>
        )}
      </CardContent>
    </Card>
  )
}
