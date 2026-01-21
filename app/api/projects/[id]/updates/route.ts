import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get project updates
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
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Clients can only see their own project updates
    if (session.user.role === "CLIENT" && project.clientId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updates = await prisma.projectUpdate.findMany({
      where: { projectId: params.id },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ updates });
  } catch (error) {
    console.error("Error fetching updates:", error);
    return NextResponse.json(
      { error: "Failed to fetch updates" },
      { status: 500 }
    );
  }
}

// POST - Create project update
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins/developers can create updates
    if (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER") {
      return NextResponse.json(
        { error: "Only team members can create project updates" },
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
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const update = await prisma.projectUpdate.create({
      data: {
        title,
        content,
        projectId: params.id,
      },
    });

    // Broadcast project update via WebSocket
    try {
      // Dynamic import to avoid issues if socket is not available
      const socketModule = await import("@/lib/socket");
      const io = socketModule.getIO();
      io.to(`project:${params.id}`).emit("refresh-project", params.id);
    } catch (error) {
      // WebSocket might not be initialized, continue anyway
      console.error("Error broadcasting update:", error);
    }

    return NextResponse.json({ update }, { status: 201 });
  } catch (error) {
    console.error("Error creating update:", error);
    return NextResponse.json(
      { error: "Failed to create update" },
      { status: 500 }
    );
  }
}
