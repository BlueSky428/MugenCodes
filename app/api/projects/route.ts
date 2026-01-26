import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - List projects (filtered by user role)
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: any = {};

    // Log for debugging
    console.log("API /projects - User role:", session.user.role, "User ID:", session.user.id);

    // Clients can only see their own projects
    if (session.user.role === "CLIENT") {
      where.clientId = session.user.id;
    }
    // For ADMIN/DEVELOPER, no clientId filter - they see all projects

    // Filter by status if provided
    if (status) {
      where.status = status;
    }

    console.log("API /projects - Query where clause:", JSON.stringify(where));

    const projects = await prisma.project.findMany({
      where,
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
        _count: {
          select: {
            updates: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("API /projects - Found projects:", projects.length);
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST - Create new project
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only clients can create projects
    if (session.user.role !== "CLIENT") {
      return NextResponse.json(
        { error: "Only clients can create projects" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, requirements, developmentCost, deadline } = body;

    if (!name || !requirements || !developmentCost || !deadline) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (developmentCost <= 0) {
      return NextResponse.json(
        { error: "Development cost must be greater than 0" },
        { status: 400 }
      );
    }

    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid deadline date" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        requirements,
        developmentCost: parseFloat(developmentCost),
        deadline: deadlineDate,
        clientId: session.user.id,
        status: "APPLICATION_IN_PROGRESS",
        feasibilityStatus: "PENDING",
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

    return NextResponse.json({ project }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating project:", error);
    // Return more specific error message
    const errorMessage = error?.message || "Failed to create project";
    return NextResponse.json(
      { error: errorMessage, details: process.env.NODE_ENV === "development" ? error?.stack : undefined },
      { status: 500 }
    );
  }
}
