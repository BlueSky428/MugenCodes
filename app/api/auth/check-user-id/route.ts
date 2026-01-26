import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// POST - Check if user ID exists
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error("Error checking user ID:", error);
    return NextResponse.json(
      { error: "Failed to check user ID" },
      { status: 500 }
    );
  }
}
