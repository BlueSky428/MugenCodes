import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { broadcastProjectChange } from "@/lib/broadcast";

// POST - Cancel/fail project (both client and team can cancel during ONGOING)
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check permissions
    const isTeam = session.user.role === "ADMIN" || session.user.role === "DEVELOPER";
    const isClient = session.user.role === "CLIENT" && project.clientId === session.user.id;

    if (!isTeam && !isClient) {
      return NextResponse.json(
        { error: "You can only cancel your own projects" },
        { status: 403 }
      );
    }

    // Only allow cancellation during DEVELOPMENT_IN_PROGRESS status
    if (project.status !== "DEVELOPMENT_IN_PROGRESS") {
      return NextResponse.json(
        { error: "Project can only be cancelled during development" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { reason, responsibility } = body;

    if (!reason || reason.trim().length === 0) {
      return NextResponse.json(
        { error: "Cancellation reason is required" },
        { status: 400 }
      );
    }

    // Determine responsibility based on who cancelled
    let finalResponsibility = responsibility;
    if (!finalResponsibility) {
      finalResponsibility = isTeam 
        ? "Development Team" 
        : "Client";
    }

    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: {
        status: "FAILED",
        failureReason: reason,
        failureResponsibility: finalResponsibility,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
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
    console.error("Error cancelling project:", error);
    return NextResponse.json(
      { error: "Failed to cancel project" },
      { status: 500 }
    );
  }
}
