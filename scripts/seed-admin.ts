import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { prisma } from "../lib/prisma";

dotenv.config();

async function main() {
  const userId = process.env.ADMIN_USER_ID || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const name = process.env.ADMIN_NAME || "Admin User";

  if (userId.trim().length < 3) {
    console.error("Error: ADMIN_USER_ID must be at least 3 characters");
    process.exit(1);
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(userId.trim())) {
    console.error("Error: ADMIN_USER_ID can only contain letters, numbers, underscores, and hyphens");
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate placeholder email for database constraint
  const placeholderEmail = `user_${userId.trim()}@placeholder.local`;

  const admin = await prisma.user.upsert({
    where: { id: userId.trim() },
    update: {
      name,
      password: hashedPassword,
      role: "ADMIN",
      email: placeholderEmail, // Update email in case it changed
    },
    create: {
      id: userId.trim(),
      email: placeholderEmail,
      name,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created/updated successfully!");
  console.log("   User ID:", admin.id);
  console.log("   Name:", admin.name);
  console.log("   Role:", admin.role);
  console.log("\n📝 You can now login with:");
  console.log("   User ID:", admin.id);
  console.log("   Password:", password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
