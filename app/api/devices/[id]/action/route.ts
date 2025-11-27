import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const { action } = body

  // Mock optimistic response
  return NextResponse.json({
    success: true,
    deviceId: id,
    action,
    timestamp: new Date().toISOString(),
  })
}
