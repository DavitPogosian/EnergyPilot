"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DeviceIcon } from "@/components/device-icon"
import { Play, Zap, ArrowUpCircle, ArrowDownCircle, Home, Power, PowerOff } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DeviceStatus } from "@/lib/types"
import { mutate } from "swr"

interface DeviceCardProps {
  device: DeviceStatus
}

export function DeviceCard({ device }: DeviceCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async (action: string) => {
    setIsLoading(true)
    try {
      await fetch(`/api/devices/${device.id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      // Refresh device data
      await mutate("/api/devices")
    } catch (error) {
      console.error("[v0] Device action failed:", error)
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
        className="gap-2"
      >
        <Play className="w-4 h-4" />
        Charge
      </Button>
      <Button onClick={() => handleAction("auto")} disabled={isLoading} size="sm" variant="outline" className="gap-2">
        <Zap className="w-4 h-4" />
        Auto
      </Button>
    </div>
  )

  const renderBatteryActions = () => (
    <div className="grid grid-cols-2 gap-2 mt-4">
      <Button onClick={() => handleAction("charge_from_grid")} disabled={isLoading} size="sm" className="gap-2">
        <ArrowDownCircle className="w-4 h-4" />
        Charge
      </Button>
      <Button
        onClick={() => handleAction("discharge_to_grid")}
        disabled={isLoading}
        size="sm"
        variant="outline"
        className="gap-2"
      >
        <ArrowUpCircle className="w-4 h-4" />
        Discharge
      </Button>
      <Button
        onClick={() => handleAction("self_consumption")}
        disabled={isLoading}
        size="sm"
        variant="outline"
        className="gap-2"
      >
        <Home className="w-4 h-4" />
        Self Use
      </Button>
      <Button onClick={() => handleAction("auto")} disabled={isLoading} size="sm" variant="outline" className="gap-2">
        <Zap className="w-4 h-4" />
        Auto
      </Button>
    </div>
  )

  const renderPPAActions = () => (
    <div className="grid grid-cols-3 gap-2 mt-4">
      <Button onClick={() => handleAction("turn_on")} disabled={isLoading} size="sm" className="gap-2">
        <Power className="w-4 h-4" />
        On
      </Button>
      <Button
        onClick={() => handleAction("turn_off")}
        disabled={isLoading}
        size="sm"
        variant="outline"
        className="gap-2"
      >
        <PowerOff className="w-4 h-4" />
        Off
      </Button>
      <Button onClick={() => handleAction("auto")} disabled={isLoading} size="sm" variant="outline" className="gap-2">
        <Zap className="w-4 h-4" />
        Auto
      </Button>
    </div>
  )

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
                  ? "Power Purchase Agreement"
                  : "Home Battery"}
            </p>
          </div>
        </div>

        {/* Device-specific info */}
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
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current Mode</span>
              <span className="font-semibold capitalize">{device.status}</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground text-center">
                Dynamic pricing based on EPEX day-ahead market
              </p>
            </div>
          </div>
        )}

        {/* Action buttons */}
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
