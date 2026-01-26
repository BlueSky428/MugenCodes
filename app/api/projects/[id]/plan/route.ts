import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { broadcastProjectChange } from "@/lib/broadcast";

// POST - Create development plan with milestones
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins/developers can create plans
    if (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER") {
      return NextResponse.json(
        { error: "Only team members can create development plans" },
        { status: 403 }
      );
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

    if (project.feasibilityStatus !== "APPROVED") {
      return NextResponse.json(
        { error: "Project must be approved before creating a plan" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { developmentPlan, milestones, action, message } = body; // action for negotiation response

    // If there's a pending negotiation from client, handle team response
    if (project.negotiationPending === "TEAM") {
      if (!action || !["approve", "reject", "renegotiate"].includes(action)) {
        return NextResponse.json(
          { error: "Invalid action. Must be 'approve', 'reject', or 'renegotiate'" },
          { status: 400 }
        );
      }

      // Team approves client's re-negotiation request - update plan/milestones
      if (action === "approve") {
        if (!developmentPlan || !milestones || !Array.isArray(milestones) || milestones.length === 0) {
          return NextResponse.json(
            { error: "Development plan and milestones are required when approving re-negotiation" },
            { status: 400 }
          );
        }

        // Validate milestones
        let totalMilestoneAmount = 0;
        for (const milestone of milestones) {
          if (!milestone.name || !milestone.amount || !milestone.dueDate) {
            return NextResponse.json(
              { error: "Each milestone must have name, amount, and dueDate" },
              { status: 400 }
            );
          }
          totalMilestoneAmount += parseFloat(milestone.amount);
        }

        const costDifference = Math.abs(totalMilestoneAmount - project.developmentCost);
        if (costDifference > 0.01) {
          return NextResponse.json(
            { error: "Milestone amounts must total the development cost" },
            { status: 400 }
          );
        }

        // Delete existing milestones
        if (project.milestones.length > 0) {
          await prisma.milestone.deleteMany({
            where: { projectId: params.id },
          });
        }

        // Create new milestones
        const createdMilestones = await prisma.$transaction(
          milestones.map((milestone: any) =>
            prisma.milestone.create({
              data: {
                name: milestone.name,
                description: milestone.description || null,
                amount: parseFloat(milestone.amount),
                dueDate: new Date(milestone.dueDate),
                projectId: params.id,
                status: "PENDING",
              },
            })
          )
        );

        // Update project - clear negotiation, update plan
        const updatedProject = await prisma.project.update({
          where: { id: params.id },
          data: {
            developmentPlan,
            negotiationPending: null,
            negotiationMessage: null,
            negotiationRequestedAt: null,
          },
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

        // Broadcast plan update via WebSocket
        await broadcastProjectChange(params.id, "status", {
          status: updatedProject.status,
          project: updatedProject,
        });

        return NextResponse.json({
          project: updatedProject,
          milestones: createdMilestones,
        });
      }

      // Team rejects client's re-negotiation request
      if (action === "reject") {
        const updatedProject = await prisma.project.update({
          where: { id: params.id },
          data: {
            status: "FAILED",
            feasibilityReason: message || "Team rejected client's re-negotiation request",
            negotiationPending: null,
            negotiationMessage: null,
            negotiationRequestedAt: null,
          },
          include: {
            client: {
              select: {
                id: true,
                name: true,
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

      // Team re-negotiates back to client
      if (action === "renegotiate") {
        if (!message || message.trim().length === 0) {
          return NextResponse.json(
            { error: "Negotiation message is required" },
            { status: 400 }
          );
        }

        // Update plan/milestones if provided, otherwise keep existing
        let updateData: any = {
          negotiationPending: "CLIENT",
          negotiationMessage: message,
          negotiationRequestedAt: new Date(),
        };

        if (developmentPlan) {
          updateData.developmentPlan = developmentPlan;
        }

        if (milestones && Array.isArray(milestones) && milestones.length > 0) {
          // Validate milestones
          let totalMilestoneAmount = 0;
          for (const milestone of milestones) {
            if (!milestone.name || !milestone.amount || !milestone.dueDate) {
              return NextResponse.json(
                { error: "Each milestone must have name, amount, and dueDate" },
                { status: 400 }
              );
            }
            totalMilestoneAmount += parseFloat(milestone.amount);
          }

          const costDifference = Math.abs(totalMilestoneAmount - project.developmentCost);
          if (costDifference > 0.01) {
            return NextResponse.json(
              { error: "Milestone amounts must total the development cost" },
              { status: 400 }
            );
          }

          // Delete existing milestones
          if (project.milestones.length > 0) {
            await prisma.milestone.deleteMany({
              where: { projectId: params.id },
            });
          }

          // Create new milestones
          await prisma.$transaction(
            milestones.map((milestone: any) =>
              prisma.milestone.create({
                data: {
                  name: milestone.name,
                  description: milestone.description || null,
                  amount: parseFloat(milestone.amount),
                  dueDate: new Date(milestone.dueDate),
                  projectId: params.id,
                  status: "PENDING",
                },
              })
            )
          );
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

        // Broadcast negotiation change via WebSocket
        await broadcastProjectChange(params.id, "status", {
          status: updatedProject.status,
          project: updatedProject,
        });

        return NextResponse.json({ project: updatedProject });
      }
    }

    // Initial plan creation (no negotiation pending)
    if (project.negotiationPending && project.negotiationPending !== "TEAM") {
      return NextResponse.json(
        { error: "Cannot create plan while negotiation is pending from team" },
        { status: 400 }
      );
    }

    if (!developmentPlan) {
      return NextResponse.json(
        { error: "Development plan is required" },
        { status: 400 }
      );
    }

    if (!milestones || !Array.isArray(milestones) || milestones.length === 0) {
      return NextResponse.json(
        { error: "At least one milestone is required" },
        { status: 400 }
      );
    }

    // Validate milestones
    let totalMilestoneAmount = 0;
    for (const milestone of milestones) {
      if (!milestone.name || !milestone.amount || !milestone.dueDate) {
        return NextResponse.json(
          { error: "Each milestone must have name, amount, and dueDate" },
          { status: 400 }
        );
      }
      totalMilestoneAmount += parseFloat(milestone.amount);
    }

    // Check if milestones total matches project cost (allow small difference)
    const costDifference = Math.abs(totalMilestoneAmount - project.developmentCost);
    if (costDifference > 0.01) {
      return NextResponse.json(
        { error: "Milestone amounts must total the development cost" },
        { status: 400 }
      );
    }

    // Delete existing milestones if any
    if (project.milestones.length > 0) {
      await prisma.milestone.deleteMany({
        where: { projectId: params.id },
      });
    }

    // Create milestones
    const createdMilestones = await prisma.$transaction(
      milestones.map((milestone: any) =>
        prisma.milestone.create({
          data: {
            name: milestone.name,
            description: milestone.description || null,
            amount: parseFloat(milestone.amount),
            dueDate: new Date(milestone.dueDate),
            projectId: params.id,
            status: "PENDING",
          },
        })
      )
    );

    // Update project with development plan (initial creation)
    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: {
        developmentPlan,
        negotiationPending: "CLIENT", // Client needs to respond
        negotiationMessage: null,
        negotiationRequestedAt: null,
      },
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

    // Broadcast plan creation via WebSocket
    await broadcastProjectChange(params.id, "status", {
      status: updatedProject.status,
      project: updatedProject,
    });

    return NextResponse.json({
      project: updatedProject,
      milestones: createdMilestones,
    });
  } catch (error) {
    console.error("Error creating development plan:", error);
    return NextResponse.json(
      { error: "Failed to create development plan" },
      { status: 500 }
    );
  }
}
