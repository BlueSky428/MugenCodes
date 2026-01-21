import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;

// Ensure Node.js runtime (Prisma/bcrypt are not Edge-compatible).
export const runtime = "nodejs";
