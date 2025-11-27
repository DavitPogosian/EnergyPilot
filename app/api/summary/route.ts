import { NextResponse } from "next/server"
import { mockDailySummary } from "@/lib/mock-data"

export async function GET() {
  return NextResponse.json(mockDailySummary)
}
