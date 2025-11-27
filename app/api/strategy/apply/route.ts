import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { intervals, devices } = body

  // Mock strategy application
  const estimatedSavings = Math.random() * 15 + 5

  return NextResponse.json({
    success: true,
    estimatedSavings: Number(estimatedSavings.toFixed(2)),
    appliedAt: new Date().toISOString(),
    intervals,
    devices,
  })
}
