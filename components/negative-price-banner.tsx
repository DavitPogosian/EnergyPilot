"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingDown, Zap } from "lucide-react"

interface NegativePriceBannerProps {
  price: number
}

export function NegativePriceBanner({ price }: NegativePriceBannerProps) {
  const handleStartCharging = async () => {
    // Start charging action
    await fetch("/api/devices/ev-1/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "charge_now" }),
    })
  }

  return (
    <Card className="bg-gradient-to-br from-success/20 via-success/10 to-success/5 border-success/30 animate-in slide-in-from-top-4 duration-500">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0">
            <TrendingDown className="w-5 h-5 text-success" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1 text-success">Get Paid to Charge!</h3>
            <p className="text-sm text-foreground mb-3 text-balance">
              Energy price is €{Math.abs(price).toFixed(2)}/MWh. You are being paid to use electricity right now.
            </p>
            <Button
              onClick={handleStartCharging}
              size="sm"
              className="bg-success hover:bg-success/90 text-success-foreground gap-2"
            >
              <Zap className="w-4 h-4" />
              Start Charging Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
