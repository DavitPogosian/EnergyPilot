import { Car, Battery, Sun, Zap } from "lucide-react"

interface DeviceIconProps {
  type: "ev" | "battery" | "ppa" | "solar"
  className?: string
}

export function DeviceIcon({ type, className }: DeviceIconProps) {
  switch (type) {
    case "ev":
      return <Car className={className} />
    case "battery":
      return <Battery className={className} />
    case "ppa":
    case "solar":
      return <Sun className={className} />
    default:
      return <Zap className={className} />
  }
}
