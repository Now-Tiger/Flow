// ============================================================================
// File: app/api/auth/signup/route.ts
// ============================================================================
import { supabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseClient
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const { data, error } = await supabaseClient
      .from("users")
      .insert([
        {
          email,
          password_hash: hashedPassword,
          first_name: firstName || null,
          last_name: lastName || null,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 400 },
      );
    }

    // Create response with auth cookie
    const response = NextResponse.json(
      { success: true, user: data[0] },
      { status: 201 },
    );

    // Set user session cookie
    response.cookies.set("user_id", data[0].id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
