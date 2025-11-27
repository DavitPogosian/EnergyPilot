import { type NextRequest, NextResponse } from "next/server"
import { generateMockPrices } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0]

  const prices = generateMockPrices(date)

  return NextResponse.json({
    region: "LU",
    date,
    prices,
  })
}
