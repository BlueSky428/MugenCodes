import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST - Submit project review
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only clients can review their own projects
    if (session.user.role !== "CLIENT") {
      return NextResponse.json(
        { error: "Only clients can submit reviews" },
        { status: 403 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        review: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.clientId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (project.status !== "SUCCEEDED") {
      return NextResponse.json(
        { error: "Project must be completed before submitting a review" },
        { status: 400 }
      );
    }

    if (project.review) {
      return NextResponse.json(
        { error: "Review already submitted for this project" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment: comment || null,
        projectId: params.id,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
