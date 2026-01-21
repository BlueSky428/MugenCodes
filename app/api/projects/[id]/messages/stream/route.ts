import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Server-Sent Events endpoint for real-time message updates
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const project = await prisma.project.findUnique({
    where: { id: params.id },
  });

  if (!project) {
    return new Response("Project not found", { status: 404 });
  }

  // Clients can only access messages for their own projects
  if (session.user.role === "CLIENT" && project.clientId !== session.user.id) {
    return new Response("Forbidden", { status: 403 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Send initial connection message
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`)
      );

      // Poll for new messages every 2 seconds
      let lastMessageId: string | null = null;
      const interval = setInterval(async () => {
        try {
          const messages = await prisma.message.findMany({
            where: {
              projectId: params.id,
              ...(lastMessageId && {
                id: { gt: lastMessageId },
              }),
            },
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
            take: 10,
          });

          if (messages.length > 0) {
            // Mark messages as read for the current user
            const unreadMessageIds = messages
              .filter(
                (msg) =>
                  !msg.read && msg.senderId !== session.user.id
              )
              .map((msg) => msg.id);

            if (unreadMessageIds.length > 0) {
              await prisma.message.updateMany({
                where: {
                  id: { in: unreadMessageIds },
                },
                data: {
                  read: true,
                  readAt: new Date(),
                },
              });
            }

            for (const message of messages) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "message", message })}\n\n`
                )
              );
            }

            lastMessageId = messages[messages.length - 1].id;
          }

          // Send heartbeat
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "heartbeat" })}\n\n`)
          );
        } catch (error) {
          console.error("Error in message stream:", error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", error: "Failed to fetch messages" })}\n\n`
            )
          );
        }
      }, 2000); // Poll every 2 seconds

      // Cleanup on client disconnect
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
