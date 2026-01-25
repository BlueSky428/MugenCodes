import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date();
    verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24); // Token expires in 24 hours

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CLIENT",
        emailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpires: verificationTokenExpires,
      },
    });

    // Send verification email
    try {
      const emailResult = await sendVerificationEmail(user.email, user.name, verificationToken);
      if (!emailResult.delivered) {
        console.error("Verification email not delivered:", {
          email: user.email,
          provider: emailResult.provider,
        });
        // Don't fail signup if email fails - user can request resend later
      }
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail signup if email fails - user can request resend later
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully. Please check your email to verify your account.",
      user: {
        id: user.id,
        email: user.email,
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

