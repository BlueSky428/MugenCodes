import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { broadcastProjectChange } from "@/lib/broadcast";

// GET - Get single project
export async function GET(
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
        review: true,
      updates: {
        orderBy: {
          createdAt: "desc",
        },
      },
      messages: {
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Clients can only see their own projects
    if (session.user.role === "CLIENT" && project.clientId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PUT - Update project
export async function PUT(
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

    // Only admins/developers can update projects
    if (session.user.role === "CLIENT" && project.clientId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const updateData: any = {};

    // Only allow certain fields to be updated
    if (body.status !== undefined) {
      updateData.status = body.status;
    }
    if (body.developmentPlan !== undefined) {
      updateData.developmentPlan = body.developmentPlan;
    }
    if (body.failureReason !== undefined) {
      updateData.failureReason = body.failureReason;
    }
    if (body.failureResponsibility !== undefined) {
      updateData.failureResponsibility = body.failureResponsibility;
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
        milestones: true,
      },
    });

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE - Delete project (admin only, failed projects only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins and developers can delete projects
    if (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER") {
      return NextResponse.json(
        { error: "Only administrators can delete projects" },
        { status: 403 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Only allow deletion of failed projects
    if (project.status !== "FAILED") {
      return NextResponse.json(
        { error: "Only failed projects can be deleted" },
        { status: 400 }
      );
    }

    // Delete the project (cascade will handle related records)
    await prisma.project.delete({
      where: { id: params.id },
    });

    // Broadcast deletion via WebSocket
    await broadcastProjectChange(params.id, "deleted", {
      projectId: params.id,
    });

    return NextResponse.json({ 
      deleted: true,
      message: "Project has been deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
