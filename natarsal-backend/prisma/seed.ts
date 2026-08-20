// D:/natarsal/natarsal-backend/prisma/seed.ts
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { config } from "../src/config/env";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  if (!config.ADMIN_PASSWORD) {
    throw new Error("❌ ADMIN_PASSWORD environment variable is required!");
  }

  // ============================================================
  // CREATE ADMIN USER - FORCE UPDATE
  // ============================================================
  const saltRounds = config.BCRYPT_SALT_ROUNDS || 12;
  const hashedPassword = await bcrypt.hash(config.ADMIN_PASSWORD, saltRounds);

  console.log(`🔐 Admin password: ${config.ADMIN_PASSWORD}`);
  console.log(`🔑 Hashed password: ${hashedPassword.substring(0, 20)}...`);

  try {
    // ✅ DELETE dulu (force reset)
    await prisma.user.deleteMany({
      where: { email: "admin@natarsal.com" },
    });
    console.log("🗑️ Existing admin deleted");

    // ✅ CREATE baru
    const admin = await prisma.user.create({
      data: {
        email: "admin@natarsal.com",
        password: hashedPassword,
        name: "Admin Natarsal",
        role: Role.ADMIN,
      },
    });
    console.log("✅ Admin user created with ID:", admin.id);
    console.log("✅ Email: admin@natarsal.com");
    console.log(`✅ Password: ${config.ADMIN_PASSWORD}`);
  } catch (error: any) {
    console.error("❌ Failed to create admin:", error.message);
  }

  // ============================================================
  // CREATE CATEGORIES (Master Data)
  // ============================================================
  const categoryNames = [
    { name: "Appetizer", slug: "appetizer" },
    { name: "Main Course", slug: "main" },
    { name: "Dessert", slug: "dessert" },
    { name: "Beverage", slug: "beverage" },
    { name: "Soup", slug: "soup" },
    { name: "Salad", slug: "salad" },
  ];

  let categoryCount = 0;
  for (const cat of categoryNames) {
    try {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name },
        create: { name: cat.name, slug: cat.slug },
      });
      categoryCount++;
      console.log(`✅ Category: ${cat.name}`);
    } catch (error: any) {
      console.error(`❌ Failed to create category ${cat.name}:`, error.message);
    }
  }
  console.log(`✅ ${categoryCount} categories seeded`);

  console.log("✅ Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
