import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { broadcastProjectChange } from "@/lib/broadcast";

// POST - Review project feasibility
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins/developers can review feasibility
    if (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER") {
      return NextResponse.json(
        { error: "Only team members can review feasibility" },
        { status: 403 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const body = await request.json();
    const { status, reason } = body;

    if (!status || (status !== "APPROVED" && status !== "REJECTED")) {
      return NextResponse.json(
        { error: "Invalid feasibility status" },
        { status: 400 }
      );
    }

    if (status === "REJECTED" && !reason) {
      return NextResponse.json(
        { error: "Reason is required when rejecting a project" },
        { status: 400 }
      );
    }

    const updateData: any = {
      feasibilityStatus: status,
      feasibilityReviewedAt: new Date(),
      feasibilityReviewedBy: session.user.id,
    };

    if (status === "REJECTED") {
      updateData.feasibilityReason = reason;
      updateData.status = "FAILED";
    } else {
      updateData.status = "DISCUSSION_IN_PROGRESS";
    }

    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: updateData,
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        milestones: {
          orderBy: {
            dueDate: "asc",
          },
        },
      },
    });

    // Broadcast status change via WebSocket
    await broadcastProjectChange(params.id, "status", {
      status: updatedProject.status,
      project: updatedProject,
    });

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error("Error reviewing feasibility:", error);
    return NextResponse.json(
      { error: "Failed to review feasibility" },
      { status: 500 }
    );
  }
}
