import { NextResponse } from "next/server"
import { mockDevices } from "@/lib/mock-data"

export async function GET() {
  return NextResponse.json({
    devices: mockDevices,
  })
}
