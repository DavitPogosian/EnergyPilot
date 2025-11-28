import { type NextRequest, NextResponse } from "next/server"

const INSIGHTS_ENDPOINT =
  "https://na08ergowl.execute-api.us-west-2.amazonaws.com/default/insights"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { intervals, devices } = body

  try {
    const response = await fetch(INSIGHTS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intervals, devices }),
      cache: "no-store",
    })
    if (!response.ok) {
      throw new Error(`Insights endpoint failed: ${response.status}`)
    }

    const insights = (await response.json()) as { estimatedSavings?: number }
    const estimatedSavings = Number(insights.estimatedSavings ?? 0)

    return NextResponse.json({
      success: true,
      estimatedSavings: Number(estimatedSavings.toFixed(2)),
      appliedAt: new Date().toISOString(),
      intervals,
      devices,
    })
  } catch (error) {
    console.error("Failed to apply strategy", error)
    return NextResponse.json(
      { success: false, error: "Unable to evaluate strategy" },
      { status: 502 }
    )
  }
}
