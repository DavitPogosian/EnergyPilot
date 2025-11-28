import { NextResponse } from "next/server"

const SUMMARY_ENDPOINT =
  "https://na08ergowl.execute-api.us-west-2.amazonaws.com/default/strategy_evaluation"

export async function GET() {
  try {
    const response = await fetch(SUMMARY_ENDPOINT, {
      // Cache busting ensures we always return latest summary values.
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Summary endpoint failed: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Failed to load summary data", error)
    return NextResponse.json(
      { error: "Unable to retrieve summary data" },
      { status: 500 }
    )
  }
}


