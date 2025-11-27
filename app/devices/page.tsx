"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BottomNav } from "@/components/bottom-nav"
import { DeviceCard } from "@/components/device-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCcw } from "lucide-react"
import useSWR, { mutate } from "swr"
import type { DeviceStatus } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function DevicesPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { data, isLoading } = useSWR<{ devices: DeviceStatus[] }>("/api/devices", fetcher, {
    refreshInterval: 10000,
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await mutate("/api/devices")
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const devices = data?.devices || []
  const evDevices = devices.filter((d) => d.type === "ev")
  const batteryDevices = devices.filter((d) => d.type === "battery")
  const ppaDevices = devices.filter((d) => d.type === "ppa")

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-lg border-b border-border">
          <div className="max-w-screen-lg mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Devices</h1>
                <p className="text-sm text-muted-foreground">Manage your energy devices</p>
              </div>
              <Button
                onClick={handleRefresh}
                size="sm"
                variant="outline"
                className="gap-2 bg-transparent"
                disabled={isRefreshing}
              >
                <RefreshCcw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-screen-lg mx-auto px-4 py-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-24 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="ev">EV</TabsTrigger>
                <TabsTrigger value="battery">Battery</TabsTrigger>
                <TabsTrigger value="ppa">PPA</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {devices.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">No devices configured</p>
                    </CardContent>
                  </Card>
                ) : (
                  devices.map((device) => <DeviceCard key={device.id} device={device} />)
                )}
              </TabsContent>

              <TabsContent value="ev" className="space-y-4">
                {evDevices.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">No EV devices configured</p>
                    </CardContent>
                  </Card>
                ) : (
                  evDevices.map((device) => <DeviceCard key={device.id} device={device} />)
                )}
              </TabsContent>

              <TabsContent value="battery" className="space-y-4">
                {batteryDevices.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">No battery devices configured</p>
                    </CardContent>
                  </Card>
                ) : (
                  batteryDevices.map((device) => <DeviceCard key={device.id} device={device} />)
                )}
              </TabsContent>

              <TabsContent value="ppa" className="space-y-4">
                {ppaDevices.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">No PPA devices configured</p>
                    </CardContent>
                  </Card>
                ) : (
                  ppaDevices.map((device) => <DeviceCard key={device.id} device={device} />)
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      <BottomNav />
    </>
  )
}
