import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedBooks } from "./content";
import { importBooks } from "./importContent";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding boeken, hoofdstukken, verzen en oefeningen (demo-inhoud)...");
  await importBooks(prisma, seedBooks);

  // --- Demo-gebruikers zodat vrienden/competitie/live game meteen te testen zijn ---
  const demoPassword = await bcrypt.hash("demo1234", 10);
  const demoUsers = [
    { email: "anna@example.com", username: "anna", displayName: "Anna" },
    { email: "bram@example.com", username: "bram", displayName: "Bram" },
    { email: "carla@example.com", username: "carla", displayName: "Carla" },
  ];

  const createdUsers = [];
  for (const u of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, passwordHash: demoPassword },
    });
    createdUsers.push(user);
  }

  const [anna, bram, carla] = createdUsers;
  await prisma.friendship.upsert({
    where: { senderId_receiverId: { senderId: anna.id, receiverId: bram.id } },
    update: { status: "ACCEPTED" },
    create: { senderId: anna.id, receiverId: bram.id, status: "ACCEPTED" },
  });
  await prisma.friendship.upsert({
    where: { senderId_receiverId: { senderId: carla.id, receiverId: anna.id } },
    update: { status: "PENDING" },
    create: { senderId: carla.id, receiverId: anna.id, status: "PENDING" },
  });

  console.log("Demo-gebruikers: anna/bram/carla (wachtwoord: demo1234)");
  console.log("Seed klaar.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
