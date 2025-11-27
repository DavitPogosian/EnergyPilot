"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Car, Battery, Sun, Zap, ChevronRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

type OnboardingStep = 1 | 2 | 3

interface OnboardingData {
  hasEV: boolean
  hasBattery: boolean
  hasSolar: boolean
  hasPPA: boolean
  minBatterySOC: number
  doNotDisturbStart: string
  doNotDisturbEnd: string
  preferSelfConsumption: boolean
  defaultStrategy: "auto" | "eco" | "aggressive"
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<OnboardingStep>(1)
  const [data, setData] = useState<OnboardingData>({
    hasEV: false,
    hasBattery: false,
    hasSolar: false,
    hasPPA: false,
    minBatterySOC: 20,
    doNotDisturbStart: "22:00",
    doNotDisturbEnd: "06:00",
    preferSelfConsumption: true,
    defaultStrategy: "auto",
  })

  const progress = (step / 3) * 100

  const handleComplete = () => {
    localStorage.setItem("energypilot_config", JSON.stringify(data))
    localStorage.setItem("energypilot_onboarded", "true")
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border">
          <div className="max-w-screen-lg mx-auto px-4 py-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-balance">Welcome to EnergyPilot</h1>
                <p className="text-sm text-muted-foreground">Step {step} of 3</p>
              </div>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-screen-lg mx-auto px-4 py-6 pb-24">
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2 text-balance">Configure your home</h2>
                  <p className="text-muted-foreground text-balance">
                    Tell us about your energy setup so we can optimize it
                  </p>
                </div>

                <Card
                  className={cn(
                    "cursor-pointer transition-all border-2",
                    data.hasEV ? "border-primary bg-primary/5" : "border-border",
                  )}
                  onClick={() => setData({ ...data, hasEV: !data.hasEV })}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            data.hasEV ? "bg-primary text-primary-foreground" : "bg-muted",
                          )}
                        >
                          <Car className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Electric Vehicle</h3>
                          <p className="text-sm text-muted-foreground">Smart charging optimization</p>
                        </div>
                      </div>
                      <Switch checked={data.hasEV} />
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    "cursor-pointer transition-all border-2",
                    data.hasBattery ? "border-primary bg-primary/5" : "border-border",
                  )}
                  onClick={() => setData({ ...data, hasBattery: !data.hasBattery })}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            data.hasBattery ? "bg-primary text-primary-foreground" : "bg-muted",
                          )}
                        >
                          <Battery className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Home Battery</h3>
                          <p className="text-sm text-muted-foreground">Store energy for later use</p>
                        </div>
                      </div>
                      <Switch checked={data.hasBattery} />
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    "cursor-pointer transition-all border-2",
                    data.hasSolar ? "border-primary bg-primary/5" : "border-border",
                  )}
                  onClick={() => setData({ ...data, hasSolar: !data.hasSolar })}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            data.hasSolar ? "bg-primary text-primary-foreground" : "bg-muted",
                          )}
                        >
                          <Sun className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Solar Panels</h3>
                          <p className="text-sm text-muted-foreground">Generate your own power</p>
                        </div>
                      </div>
                      <Switch checked={data.hasSolar} />
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    "cursor-pointer transition-all border-2",
                    data.hasPPA ? "border-primary bg-primary/5" : "border-border",
                  )}
                  onClick={() => setData({ ...data, hasPPA: !data.hasPPA })}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            data.hasPPA ? "bg-primary text-primary-foreground" : "bg-muted",
                          )}
                        >
                          <Zap className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Smart PPA</h3>
                          <p className="text-sm text-muted-foreground">Dynamic pricing plan</p>
                        </div>
                      </div>
                      <Switch checked={data.hasPPA} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2 text-balance">Comfort settings</h2>
                  <p className="text-muted-foreground text-balance">Set your preferences for energy management</p>
                </div>

                {data.hasBattery && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Minimum Battery Reserve</CardTitle>
                      <CardDescription>Keep your battery above this level for emergencies</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold tabular-nums">{data.minBatterySOC}%</span>
                        <Battery className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <Slider
                        value={[data.minBatterySOC]}
                        onValueChange={([value]) => setData({ ...data, minBatterySOC: value })}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">Recommended: 20% for backup power</p>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Do Not Disturb Hours</CardTitle>
                    <CardDescription>Prevent charging/discharging during these hours</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-time">Start Time</Label>
                        <input
                          id="start-time"
                          type="time"
                          value={data.doNotDisturbStart}
                          onChange={(e) => setData({ ...data, doNotDisturbStart: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-time">End Time</Label>
                        <input
                          id="end-time"
                          type="time"
                          value={data.doNotDisturbEnd}
                          onChange={(e) => setData({ ...data, doNotDisturbEnd: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 pr-4">
                        <h3 className="font-semibold mb-1">Prefer Self-Consumption</h3>
                        <p className="text-sm text-muted-foreground">
                          Use solar energy locally before exporting to grid
                        </p>
                      </div>
                      <Switch
                        checked={data.preferSelfConsumption}
                        onCheckedChange={(checked) => setData({ ...data, preferSelfConsumption: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2 text-balance">Choose your strategy</h2>
                  <p className="text-muted-foreground text-balance">
                    Select how EnergyPilot should manage your devices
                  </p>
                </div>

                <Card
                  className={cn(
                    "cursor-pointer transition-all border-2",
                    data.defaultStrategy === "auto" ? "border-primary bg-primary/5" : "border-border",
                  )}
                  onClick={() => setData({ ...data, defaultStrategy: "auto" })}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                          data.defaultStrategy === "auto" ? "bg-primary text-primary-foreground" : "bg-muted",
                        )}
                      >
                        {data.defaultStrategy === "auto" ? <Check className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">SmartShift (Auto)</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          AI-powered optimization for maximum savings
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-xs px-2 py-1 rounded-md bg-success/10 text-success">Best Savings</span>
                          <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                            Recommended
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    "cursor-pointer transition-all border-2",
                    data.defaultStrategy === "eco" ? "border-primary bg-primary/5" : "border-border",
                  )}
                  onClick={() => setData({ ...data, defaultStrategy: "eco" })}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                          data.defaultStrategy === "eco" ? "bg-primary text-primary-foreground" : "bg-muted",
                        )}
                      >
                        {data.defaultStrategy === "eco" ? <Check className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">ECO Mode</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Prioritize renewable energy and self-consumption
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-xs px-2 py-1 rounded-md bg-success/10 text-success">Low Carbon</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    "cursor-pointer transition-all border-2",
                    data.defaultStrategy === "aggressive" ? "border-primary bg-primary/5" : "border-border",
                  )}
                  onClick={() => setData({ ...data, defaultStrategy: "aggressive" })}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                          data.defaultStrategy === "aggressive" ? "bg-primary text-primary-foreground" : "bg-muted",
                        )}
                      >
                        {data.defaultStrategy === "aggressive" ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Battery className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Peak Shaving</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Maximize grid arbitrage and export during peaks
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-xs px-2 py-1 rounded-md bg-warning/10 text-warning">High Activity</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50 border-dashed">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground text-center">
                      You can always change your strategy later in settings
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Footer with navigation */}
        <div className="sticky bottom-0 bg-card border-t border-border">
          <div className="max-w-screen-lg mx-auto px-4 py-4">
            <div className="flex gap-3">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep((step - 1) as OnboardingStep)} className="flex-1">
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button onClick={() => setStep((step + 1) as OnboardingStep)} className="flex-1">
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleComplete} className="flex-1">
                  Get Started
                  <Check className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
