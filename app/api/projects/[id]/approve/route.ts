import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { broadcastProjectChange } from "@/lib/broadcast";

// POST - Client responds to milestone: approve, reject, or renegotiate
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only clients can respond to their own projects
    if (session.user.role !== "CLIENT") {
      return NextResponse.json(
        { error: "Only clients can respond to milestones" },
        { status: 403 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        milestones: {
          orderBy: {
            dueDate: "asc",
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.clientId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (project.status !== "DISCUSSION_IN_PROGRESS") {
      return NextResponse.json(
        { error: "Project is not in the correct status for this action" },
        { status: 400 }
      );
    }

    if (!project.developmentPlan || project.milestones.length === 0) {
      return NextResponse.json(
        { error: "Development plan and milestones must be created first" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { action, message } = body; // action: "approve", "reject", or "renegotiate"

    if (!action || !["approve", "reject", "renegotiate"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve', 'reject', or 'renegotiate'" },
        { status: 400 }
      );
    }

    // Handle approval
    if (action === "approve") {
      const { paymentConfirmed } = body;
      if (!paymentConfirmed) {
        return NextResponse.json(
          { error: "Payment confirmation is required for approval" },
          { status: 400 }
        );
      }

      const firstMilestone = project.milestones[0];
      if (!firstMilestone) {
        return NextResponse.json(
          { error: "No milestones found" },
          { status: 400 }
        );
      }

      // Mark first milestone as paid
      await prisma.milestone.update({
        where: { id: firstMilestone.id },
        data: {
          status: "PAID",
          paidAt: new Date(),
        },
      });

      // Update project status and total paid, clear negotiation fields
      const updatedProject = await prisma.project.update({
        where: { id: params.id },
        data: {
          status: "DEVELOPMENT_IN_PROGRESS",
          totalPaid: firstMilestone.amount,
          negotiationPending: null,
          negotiationMessage: null,
          negotiationRequestedAt: null,
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
    }

    // Handle rejection
    if (action === "reject") {
      const updatedProject = await prisma.project.update({
        where: { id: params.id },
        data: {
          status: "FAILED",
          feasibilityReason: message || "Client rejected the milestone proposal",
          negotiationPending: null,
          negotiationMessage: null,
          negotiationRequestedAt: null,
        },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
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
    }

    // Handle re-negotiation
    if (action === "renegotiate") {
      if (!message || message.trim().length === 0) {
        return NextResponse.json(
          { error: "Negotiation message is required" },
          { status: 400 }
        );
      }

      const updatedProject = await prisma.project.update({
        where: { id: params.id },
        data: {
          negotiationPending: "TEAM",
          negotiationMessage: message,
          negotiationRequestedAt: new Date(),
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

      // Broadcast negotiation change via WebSocket
      await broadcastProjectChange(params.id, "status", {
        status: updatedProject.status,
        project: updatedProject,
      });

      return NextResponse.json({ project: updatedProject });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error processing client response:", error);
    return NextResponse.json(
      { error: "Failed to process response" },
      { status: 500 }
    );
  }
}
