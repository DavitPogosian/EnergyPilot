"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BottomNav } from "@/components/bottom-nav"
import { BellOff, TrendingDown, Battery, Car, CheckCircle, Zap, Clock, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: "negative_price" | "battery_charged" | "ev_charged" | "strategy_executed" | "info"
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  action?: {
    label: string
    handler: () => void
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "negative_price",
      title: "Negative Price Alert",
      message: "Energy price is -€2.50/MWh. Start charging your battery from the grid.",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
      action: {
        label: "Start Charging",
        handler: () => console.log("[v0] Start charging"),
      },
    },
    {
      id: "2",
      type: "battery_charged",
      title: "Battery Fully Charged",
      message: "Your home battery has reached 100% charge during off-peak hours.",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      isRead: false,
    },
    {
      id: "3",
      type: "ev_charged",
      title: "EV Charging Complete",
      message: "Tesla Model 3 is now charged to 80% as requested.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
    },
    {
      id: "4",
      type: "info",
      title: "Strategy change recommended",
      message: "Clouds expected this afternoon. Consider switching to self-consumption mode to maximise your free solar energy",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isRead: true,
      action: {
        label: "Apply Strategy",
        handler: () => console.log("[v0] View strategy"),
      },
    },
    {
      id: "5",
      type: "strategy_executed",
      title: "Strategy Applied",
      message: "SmartShift AI strategy has been activated. Estimated savings: €12.45 today.",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      isRead: true,
    },
    
  ])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
  }

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "negative_price":
        return <TrendingDown className="w-5 h-5" />
      case "battery_charged":
        return <Battery className="w-5 h-5" />
      case "ev_charged":
        return <Car className="w-5 h-5" />
      case "strategy_executed":
        return <CheckCircle className="w-5 h-5" />
      default:
        return <Zap className="w-5 h-5" />
    }
  }

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "negative_price":
        return "bg-success/10 text-success"
      case "battery_charged":
        return "bg-warning/10 text-warning"
      case "ev_charged":
        return "bg-primary/10 text-primary"
      case "strategy_executed":
        return "bg-accent/10 text-accent-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
  }

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-lg border-b border-border">
          <div className="max-w-screen-lg mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-2xl font-bold">Notifications</h1>
                <p className="text-sm text-muted-foreground">
                  {unreadCount > 0 ? `${unreadCount} unread alerts` : "All caught up"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button onClick={handleMarkAllAsRead} size="sm" variant="outline" className="gap-2 bg-transparent">
                    <CheckCircle className="w-4 h-4" />
                    Mark All
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-screen-lg mx-auto px-4 py-6">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <BellOff className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No notifications</h3>
                <p className="text-sm text-muted-foreground">
                  You will be notified about energy events and opportunities
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={cn("transition-all", !notification.isRead && "bg-primary/5 border-primary/20")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                          getNotificationColor(notification.type),
                        )}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-balance">{notification.title}</h3>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 flex-shrink-0"
                            onClick={() => handleDelete(notification.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 text-balance">{notification.message}</p>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(notification.timestamp)}
                          </div>
                          {!notification.isRead && (
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                              New
                            </Badge>
                          )}
                        </div>
                        {notification.action && (
                          <Button
                            onClick={() => {
                              notification.action?.handler()
                              handleMarkAsRead(notification.id)
                            }}
                            size="sm"
                            className="mt-3 w-full"
                          >
                            {notification.action.label}
                          </Button>
                        )}
                        {!notification.isRead && !notification.action && (
                          <Button
                            onClick={() => handleMarkAsRead(notification.id)}
                            size="sm"
                            variant="outline"
                            className="mt-3"
                          >
                            Mark as Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </>
  )
}
