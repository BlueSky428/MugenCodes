import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { broadcastProjectChange } from "@/lib/broadcast";

// POST - Record milestone payment
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
      include: {
        milestones: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Clients can only pay for their own projects
    if (session.user.role === "CLIENT" && project.clientId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { milestoneId, paymentConfirmed } = body;

    if (!milestoneId || !paymentConfirmed) {
      return NextResponse.json(
        { error: "Milestone ID and payment confirmation are required" },
        { status: 400 }
      );
    }

    const milestone = project.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
    }

    if (milestone.status === "PAID") {
      return NextResponse.json(
        { error: "Milestone is already paid" },
        { status: 400 }
      );
    }

    // Update milestone
    await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });

    // Update project total paid
    const newTotalPaid = project.totalPaid + milestone.amount;
    const allMilestonesPaid = project.milestones.every(
      (m) => m.id === milestoneId || m.status === "PAID"
    );

    const updateData: any = {
      totalPaid: newTotalPaid,
    };

    // If all milestones are paid, mark project as ready for completion
    if (allMilestonesPaid) {
      updateData.status = "SUCCEEDED";
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

    // Broadcast payment/status change via WebSocket
    await broadcastProjectChange(params.id, allMilestonesPaid ? "status" : "payment", {
      status: updatedProject.status,
      project: updatedProject,
    });

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error("Error recording payment:", error);
    return NextResponse.json(
      { error: "Failed to record payment" },
      { status: 500 }
    );
  }
}
