export interface PriceData {
  timestamp: string
  price: number
  isPeak: boolean
  isNegative: boolean
}

export interface DeviceStatus {
  id: string
  type: "ev" | "battery" | "ppa" | "heatpump"
  name: string
  isOnline: boolean
  locked?: boolean 
  soc?: number
  capacity?: number
  chargingRate?: number
  isPlugged?: boolean
  isCharging?: boolean
  status: "idle" | "charging" | "discharging" | "auto"
}

export interface Strategy {
  id: string
  name: string
  type: "auto" | "eco" | "aggressive" | "custom"
  intervals: StrategyInterval[]
}

export interface StrategyInterval {
  start: string
  end: string
  action: "charge_from_grid" | "discharge_to_grid" | "self_consumption" | "idle"
}

export interface UserConfig {
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

export interface DailySummary {
  estimatedCost: number
  gridExportIncome: number
  co2Avoided: number
  batterySoc: number
  evSoc: number
  userPercentile: number
}
