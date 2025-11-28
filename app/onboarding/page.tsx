"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Car, Battery, Sun, Zap, ChevronRight, Check, Thermometer } from "lucide-react"
import { cn } from "@/lib/utils"

type OnboardingStep = 1 | 2 | 3

interface QuestionnaireAnswers {
  expectation: "reduce_bills" | "clean_footprint" | null
  activity: "fully_active" | "leave_alone" | null
}

interface OnboardingData {
  hasEV: boolean
  hasBattery: boolean
  hasSolar: boolean
  hasPPA: boolean
  hasHeatpump: boolean
  minBatterySOC: number
  doNotDisturbStart: string
  doNotDisturbEnd: string
  preferSelfConsumption: boolean
  defaultStrategy: "custom" | "auto" | "eco" | "aggressive"
  questionnaire: QuestionnaireAnswers
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<OnboardingStep>(1)
  const [data, setData] = useState<OnboardingData>({
    hasEV: false,
    hasBattery: false,
    hasSolar: false,
    hasPPA: false,
    hasHeatpump: false,
    minBatterySOC: 20,
    doNotDisturbStart: "22:00",
    doNotDisturbEnd: "06:00",
    preferSelfConsumption: true,
    defaultStrategy: "auto",
    questionnaire: {
      expectation: null,
      activity: null,
    },
  })

  const progress = (step / 3) * 100

  const determineStrategy = (): OnboardingData["defaultStrategy"] => {
    const { expectation, activity } = data.questionnaire
    if (expectation === "reduce_bills" && activity === "fully_active") return "custom"
    if (expectation === "reduce_bills" && activity === "leave_alone") return "auto"
    if (expectation === "clean_footprint" && activity === "fully_active") return "eco"
    if (expectation === "clean_footprint" && activity === "leave_alone") return "aggressive"
    return "auto"
  }

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
                    data.hasHeatpump ? "border-primary bg-primary/5" : "border-border",
                  )}
                  onClick={() => setData({ ...data, hasHeatpump: !data.hasHeatpump })}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            data.hasHeatpump ? "bg-primary text-primary-foreground" : "bg-muted",
                          )}
                        >
                          <Thermometer className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Heat Pump</h3>
                          <p className="text-sm text-muted-foreground">Heat Pump</p>
                        </div>
                      </div>
                      <Switch checked={data.hasHeatpump} />
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
                          <h3 className="font-semibold">Dynamic Tariff</h3>
                          <p className="text-sm text-muted-foreground">Follows market prices every 15 minutes</p>
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
                  <h2 className="text-2xl font-bold mb-2 text-balance">Tell us about yourself</h2>
                  <p className="text-muted-foreground text-balance">Help us understand your preferences</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>What do you expect from me most?</CardTitle>
                    <CardDescription>Choose the option that matters most to you</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Card
                      className={cn(
                        "cursor-pointer transition-all border-2",
                        data.questionnaire.expectation === "reduce_bills"
                          ? "border-primary bg-primary/5"
                          : "border-border",
                      )}
                      onClick={() =>
                        setData({
                          ...data,
                          questionnaire: { ...data.questionnaire, expectation: "reduce_bills" },
                        })
                      }
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                              data.questionnaire.expectation === "reduce_bills"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted",
                            )}
                          >
                            {data.questionnaire.expectation === "reduce_bills" ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <Zap className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">Reduce my bills and why not make some money</h3>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      className={cn(
                        "cursor-pointer transition-all border-2",
                        data.questionnaire.expectation === "clean_footprint"
                          ? "border-primary bg-primary/5"
                          : "border-border",
                      )}
                      onClick={() =>
                        setData({
                          ...data,
                          questionnaire: { ...data.questionnaire, expectation: "clean_footprint" },
                        })
                      }
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                              data.questionnaire.expectation === "clean_footprint"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted",
                            )}
                          >
                            {data.questionnaire.expectation === "clean_footprint" ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <Sun className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">Leave a clean footprint in this household</h3>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>How active do you want to be?</CardTitle>
                    <CardDescription>Choose your preferred level of involvement</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Card
                      className={cn(
                        "cursor-pointer transition-all border-2",
                        data.questionnaire.activity === "fully_active"
                          ? "border-primary bg-primary/5"
                          : "border-border",
                      )}
                      onClick={() =>
                        setData({
                          ...data,
                          questionnaire: { ...data.questionnaire, activity: "fully_active" },
                        })
                      }
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                              data.questionnaire.activity === "fully_active"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted",
                            )}
                          >
                            {data.questionnaire.activity === "fully_active" ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <Battery className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">I am fully onboard and active all the time</h3>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      className={cn(
                        "cursor-pointer transition-all border-2",
                        data.questionnaire.activity === "leave_alone" ? "border-primary bg-primary/5" : "border-border",
                      )}
                      onClick={() =>
                        setData({
                          ...data,
                          questionnaire: { ...data.questionnaire, activity: "leave_alone" },
                        })
                      }
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                              data.questionnaire.activity === "leave_alone"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted",
                            )}
                          >
                            {data.questionnaire.activity === "leave_alone" ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <Car className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">Leave me alone, you manage everything</h3>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2 text-balance">Your recommended strategy</h2>
                  <p className="text-muted-foreground text-balance">
                    Based on your preferences, we selected the best strategy for you
                  </p>
                </div>

                {/* Custom Strategy */}
                <div
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border-2",
                    data.defaultStrategy === "custom"
                      ? "bg-primary/5 border-primary/20"
                      : "bg-muted/30 border-border opacity-50",
                  )}
                  onClick={() => setData({ ...data, defaultStrategy: "custom" })}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {data.defaultStrategy === "custom" ? (
                      <Check className="w-5 h-5 text-primary" />
                    ) : (
                      <Zap className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Custom</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Full control over your energy strategy. Edit timeline blocks to create custom schedules.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <span
                        data-slot="badge"
                        className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 bg-primary/10 text-primary border-primary/20"
                      >
                        Full Control
                      </span>
                      <span
                        data-slot="badge"
                        className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 bg-muted text-muted-foreground"
                      >
                        Advanced
                      </span>
                    </div>
                  </div>
                </div>

                {/* SmartShift AI Strategy */}
                <div
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border-2",
                    data.defaultStrategy === "auto"
                      ? "bg-primary/5 border-primary/20"
                      : "bg-muted/30 border-border opacity-50",
                  )}
                  onClick={() => setData({ ...data, defaultStrategy: "auto" })}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {data.defaultStrategy === "auto" ? (
                      <Check className="w-5 h-5 text-primary" />
                    ) : (
                      <Zap className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">SmartShift AI Strategy</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      AI-powered optimization that charges during low prices and discharges during peak hours for
                      maximum savings.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <span
                        data-slot="badge"
                        className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 bg-success/10 text-success border-success/20"
                      >
                        Best Savings
                      </span>
                      <span
                        data-slot="badge"
                        className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 bg-primary/10 text-primary border-primary/20"
                      >
                        Recommended
                      </span>
                    </div>
                  </div>
                </div>

                {/* ECO Mode */}
                <div
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border-2",
                    data.defaultStrategy === "eco"
                      ? "bg-success/5 border-success/20"
                      : "bg-muted/30 border-border opacity-50",
                  )}
                  onClick={() => setData({ ...data, defaultStrategy: "eco" })}
                >
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                    {data.defaultStrategy === "eco" ? (
                      <Check className="w-5 h-5 text-success" />
                    ) : (
                      <Sun className="w-5 h-5 text-success" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">ECO Mode</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Prioritizes renewable energy and self-consumption. Minimizes grid interaction and reduces
                      carbon footprint.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <span
                        data-slot="badge"
                        className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 bg-success/10 text-success border-success/20"
                      >
                        Low Carbon
                      </span>
                      <span
                        data-slot="badge"
                        className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 bg-muted text-muted-foreground"
                      >
                        Self Sufficient
                      </span>
                    </div>
                  </div>
                </div>

                {/* Peak Shaving */}
                <div
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border-2",
                    data.defaultStrategy === "aggressive"
                      ? "bg-warning/5 border-warning/20"
                      : "bg-muted/30 border-border opacity-50",
                  )}
                  onClick={() => setData({ ...data, defaultStrategy: "aggressive" })}
                >
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                    {data.defaultStrategy === "aggressive" ? (
                      <Check className="w-5 h-5 text-warning" />
                    ) : (
                      <Battery className="w-5 h-5 text-warning" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Peak Shaving</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Maximizes grid arbitrage by discharging to grid during peak hours. Best for earning from high
                      export prices.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <span
                        data-slot="badge"
                        className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 bg-warning/10 text-warning border-warning/20"
                      >
                        High Revenue
                      </span>
                      <span
                        data-slot="badge"
                        className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 bg-muted text-muted-foreground"
                      >
                        Grid Export
                      </span>
                    </div>
                  </div>
                </div>

                <Card className="bg-muted/50 border-dashed">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground text-center">
                      You can always change your strategy later in the Strategy Editor
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
                <Button
                  onClick={() => {
                    if (step === 2) {
                      const strategy = determineStrategy()
                      setData({ ...data, defaultStrategy: strategy })
                    }
                    setStep((step + 1) as OnboardingStep)
                  }}
                  className="flex-1"
                >
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