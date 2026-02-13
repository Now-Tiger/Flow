// ============================================================================
// File: app/api/auth/logout/route.ts
// ============================================================================
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true }, { status: 200 });

  // Clear user session cookie
  response.cookies.set("user_id", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });

  return response;
}
