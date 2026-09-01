// Seeds an admin user, a customer user, and a few sample resources
// so the app is immediately usable after `npm run prisma:seed`.
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const customerPassword = await bcrypt.hash("Customer123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@booking.app" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@booking.app",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@booking.app" },
    update: {},
    create: {
      name: "Jane Customer",
      email: "customer@booking.app",
      password: customerPassword,
      role: "CUSTOMER",
    },
  });

  const resources = [
    { name: "Meeting Room A", description: "4-person room with whiteboard", location: "Floor 1", capacity: 4, pricePerHour: 10 },
    { name: "Meeting Room B", description: "Large room with projector", location: "Floor 2", capacity: 10, pricePerHour: 20 },
    { name: "Main Desk", description: "Shared desk for focused work", location: "Floor 1", capacity: 2, pricePerHour: 3 },
  ];

  // If a DB seeded before this change still has the old "Hot Desk 1" row,
  // rename/update it in place instead of leaving a stale duplicate behind.
  const legacyDesk = await prisma.resource.findFirst({ where: { name: "Hot Desk 1" } });
  if (legacyDesk) {
    await prisma.resource.update({
      where: { id: legacyDesk.id },
      data: { name: "Main Desk", description: "Shared desk for focused work", capacity: 2 },
    });
  }

  for (const r of resources) {
    const exists = await prisma.resource.findFirst({ where: { name: r.name } });
    if (!exists) {
      await prisma.resource.create({ data: r });
    }
  }

  console.log("Seed complete.");
  console.log("Admin login:    admin@booking.app / Admin123!");
  console.log("Customer login: customer@booking.app / Customer123!");
  console.log({ admin: admin.email, customer: customer.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
