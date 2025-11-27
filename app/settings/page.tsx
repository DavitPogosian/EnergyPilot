"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { BottomNav } from "@/components/bottom-nav"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Settings2, Globe, Battery, Lock, Moon, Sun, Laptop, Trash2, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import type { UserConfig } from "@/lib/types"

export default function SettingsPage() {
  const router = useRouter()
  const [config, setConfig] = useState<UserConfig>({
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
  const [demoMode, setDemoMode] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")

  useEffect(() => {
    const stored = localStorage.getItem("energypilot_config")
    if (stored) {
      setConfig(JSON.parse(stored))
    }
    const storedDemo = localStorage.getItem("energypilot_demo_mode")
    setDemoMode(storedDemo === "true")
  }, [])

  const handleSaveConfig = () => {
    localStorage.setItem("energypilot_config", JSON.stringify(config))
    localStorage.setItem("energypilot_demo_mode", String(demoMode))
  }

  const handleResetApp = () => {
    localStorage.clear()
    setShowResetDialog(false)
    router.push("/onboarding")
  }

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark")
    } else {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (isDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [theme])

  return (
    <>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-lg border-b border-border">
          <div className="max-w-screen-lg mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-sm text-muted-foreground">Manage your preferences</p>
              </div>
              <Button onClick={handleSaveConfig} size="sm">
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-6">
          {/* Device Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="w-5 h-5" />
                Device Configuration
              </CardTitle>
              <CardDescription>Configure which devices you have connected</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="has-ev" className="font-medium">
                    Electric Vehicle
                  </Label>
                  <p className="text-sm text-muted-foreground">Enable EV charging optimization</p>
                </div>
                <Switch
                  id="has-ev"
                  checked={config.hasEV}
                  onCheckedChange={(checked) => setConfig({ ...config, hasEV: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="has-battery" className="font-medium">
                    Home Battery
                  </Label>
                  <p className="text-sm text-muted-foreground">Enable battery storage management</p>
                </div>
                <Switch
                  id="has-battery"
                  checked={config.hasBattery}
                  onCheckedChange={(checked) => setConfig({ ...config, hasBattery: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="has-solar" className="font-medium">
                    Solar Panels
                  </Label>
                  <p className="text-sm text-muted-foreground">Track solar generation</p>
                </div>
                <Switch
                  id="has-solar"
                  checked={config.hasSolar}
                  onCheckedChange={(checked) => setConfig({ ...config, hasSolar: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="has-ppa" className="font-medium">
                    Smart PPA
                  </Label>
                  <p className="text-sm text-muted-foreground">Dynamic pricing agreement</p>
                </div>
                <Switch
                  id="has-ppa"
                  checked={config.hasPPA}
                  onCheckedChange={(checked) => setConfig({ ...config, hasPPA: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Energy Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Battery className="w-5 h-5" />
                Energy Preferences
              </CardTitle>
              <CardDescription>Customize your energy management settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {config.hasBattery && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Minimum Battery Reserve</Label>
                    <span className="text-sm font-bold tabular-nums">{config.minBatterySOC}%</span>
                  </div>
                  <Slider
                    value={[config.minBatterySOC]}
                    onValueChange={([value]) => setConfig({ ...config, minBatterySOC: value })}
                    min={0}
                    max={100}
                    step={5}
                  />
                </div>
              )}

              <div className="space-y-3">
                <Label>Do Not Disturb Hours</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="dnd-start" className="text-xs text-muted-foreground">
                      Start Time
                    </Label>
                    <input
                      id="dnd-start"
                      type="time"
                      value={config.doNotDisturbStart}
                      onChange={(e) => setConfig({ ...config, doNotDisturbStart: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dnd-end" className="text-xs text-muted-foreground">
                      End Time
                    </Label>
                    <input
                      id="dnd-end"
                      type="time"
                      value={config.doNotDisturbEnd}
                      onChange={(e) => setConfig({ ...config, doNotDisturbEnd: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="self-consumption" className="font-medium">
                    Prefer Self-Consumption
                  </Label>
                  <p className="text-sm text-muted-foreground">Use solar locally before exporting</p>
                </div>
                <Switch
                  id="self-consumption"
                  checked={config.preferSelfConsumption}
                  onCheckedChange={(checked) => setConfig({ ...config, preferSelfConsumption: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Default Strategy</Label>
                <Select
                  value={config.defaultStrategy}
                  onValueChange={(value: "auto" | "eco" | "aggressive") =>
                    setConfig({ ...config, defaultStrategy: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">SmartShift (Auto)</SelectItem>
                    <SelectItem value="eco">ECO Mode</SelectItem>
                    <SelectItem value="aggressive">Peak Shaving</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="w-5 h-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize how EnergyPilot looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    onClick={() => setTheme("light")}
                    className="gap-2"
                  >
                    <Sun className="w-4 h-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    onClick={() => setTheme("dark")}
                    className="gap-2"
                  >
                    <Moon className="w-4 h-4" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    onClick={() => setTheme("system")}
                    className="gap-2"
                  >
                    <Laptop className="w-4 h-4" />
                    System
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Region & Language */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Region & Language
              </CardTitle>
              <CardDescription>Set your location and language preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Region</Label>
                <Select defaultValue="lu">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lu">Luxembourg</SelectItem>
                    <SelectItem value="de">Germany (Berlin)</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="be">Belgium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="lu">Lëtzebuergesch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Privacy & Data
              </CardTitle>
              <CardDescription>Control your data and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="demo-mode" className="font-medium">
                    Demo Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">Use sample data for testing</p>
                </div>
                <Switch id="demo-mode" checked={demoMode} onCheckedChange={setDemoMode} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="anonymous" className="font-medium">
                    Anonymous Leaderboard
                  </Label>
                  <p className="text-sm text-muted-foreground">Hide your identity in rankings</p>
                </div>
                <Switch id="anonymous" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Version</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Region</span>
                <span className="font-medium">Luxembourg (EPEX)</span>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border border-dashed">
                <p className="text-xs text-muted-foreground text-center text-balance">
                  EnergyPilot helps you optimize energy costs using day-ahead market prices
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full gap-2 border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent"
                onClick={() => setShowResetDialog(true)}
              >
                <Trash2 className="w-4 h-4" />
                Reset All Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset All Settings?</DialogTitle>
            <DialogDescription>
              This will delete all your data and return you to the onboarding flow. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleResetApp}>
              Reset Everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </>
  )
}
