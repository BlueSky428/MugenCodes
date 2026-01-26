import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  try {
    const body = await request.json();
    const { userId, name, password } = body;

    if (!userId || !name || !password) {
      return NextResponse.json(
        { error: "User ID, name, and password are required" },
        { status: 400 }
      );
    }

    if (userId.trim().length < 3) {
      return NextResponse.json(
        { error: "User ID must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(userId.trim())) {
      return NextResponse.json(
        { error: "User ID can only contain letters, numbers, underscores, and hyphens" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    // Check if User ID already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId.trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "This User ID is already taken. Please choose another one." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a placeholder email for database constraint
    const placeholderEmail = `user_${userId.trim()}@placeholder.local`;

    const user = await prisma.user.create({
      data: {
        id: userId.trim(), // Use the user-provided ID
        name: name.trim(),
        email: placeholderEmail, // Placeholder email for database constraint
        password: hashedPassword,
        role: "CLIENT",
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
      },
    });
  } catch (error) {
    const err = error as any;
    console.error("Signup error:", {
      requestId,
      name: err?.name,
      message: err?.message,
      code: err?.code,
    });
    return NextResponse.json(
      {
        error: "An error occurred while creating your account",
        requestId,
        code: err?.code || "UNKNOWN",
      },
      { status: 500 }
    );
  }
}

