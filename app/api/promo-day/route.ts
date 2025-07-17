import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();
  // getDay: 0=Sunday, 1=Monday, ..., 6=Saturday
  return NextResponse.json({
    iso: now.toISOString(),
    day: now.getDay(),
    date: now.toDateString(),
  });
}
