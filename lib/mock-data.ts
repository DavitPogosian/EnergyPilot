import type { PriceData, DeviceStatus, DailySummary } from "./types"

export function generateMockPrices(date: string): PriceData[] {
  const prices: PriceData[] = []
  const baseDate = new Date(date)

  for (let i = 0; i < 48; i++) {
    const hour = Math.floor(i / 2)
    const minute = (i % 2) * 30

    const timestamp = new Date(baseDate)
    timestamp.setHours(hour, minute, 0, 0)

    let price: number
    if (hour >= 2 && hour <= 5) {
      price = -3.2 + Math.random() * 2
    } else if (hour >= 6 && hour <= 8) {
      price = 1 + Math.random() * 3
    } else if (hour >= 17 && hour <= 20) {
      price = 8 + Math.random() * 5
    } else if (hour >= 21 && hour <= 23) {
      price = 4 + Math.random() * 3
    } else {
      price = 0.5 + Math.random() * 2
    }

    prices.push({
      timestamp: timestamp.toISOString(),
      price: Number(price.toFixed(2)),
      isPeak: hour >= 17 && hour <= 20,
      isNegative: price < 0,
    })
  }

  return prices
}

export const mockDevices: DeviceStatus[] = [
  {
    id: "ev-1",
    type: "ev",
    name: "Tesla Model 3",
    isOnline: true,
    soc: 65,
    capacity: 75,
    chargingRate: 7.4,
    isPlugged: true,
    isCharging: false,
    status: "auto",
  },
  {
    id: "battery-1",
    type: "battery",
    name: "Home Battery",
    isOnline: true,
    soc: 45,
    capacity: 10,
    status: "auto",
  },
  {
    id: "ppa-1",
    type: "ppa",
    name: "Solar PPA",
    isOnline: true,
    status: "auto",
  },
]

export const mockDailySummary: DailySummary = {
  estimatedCost: 12.45,
  gridExportIncome: 3.2,
  co2Avoided: 8.5,
  batterySoc: 45,
  evSoc: 65,
  userPercentile: 85,
}
