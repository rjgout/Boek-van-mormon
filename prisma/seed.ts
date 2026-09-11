import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedBooks } from "./content";
import { importBooks } from "./importContent";

const prisma = new PrismaClient();

// Namen/omschrijvingen bij de achievement-slugs uit src/lib/achievements.ts.
const achievementDefs = [
  { slug: "streak-7", name: "Eerste week", icon: "🔥", description: "Hield 7 dagen op rij een streak vol." },
  { slug: "streak-30", name: "Vol doorgezet", icon: "🔥", description: "Hield 30 dagen op rij een streak vol." },
  { slug: "first-chapter", name: "Eerste hoofdstuk", icon: "📖", description: "Rondde je eerste hoofdstuk af." },
  { slug: "xp-1000", name: "1000 XP", icon: "⭐", description: "Verdiende in totaal 1000 XP." },
  { slug: "first-freeze-earned", name: "Eerste freeze", icon: "🧊", description: "Verdiende je eerste streak freeze." },
  {
    slug: "first-freeze-gifted",
    name: "Vrijgevig",
    icon: "🎁",
    description: "Gaf je eerste streak freeze cadeau aan een vriend.",
  },
  { slug: "first-friend", name: "Niet alleen", icon: "👥", description: "Voegde je eerste vriend toe." },
  { slug: "first-duel-won", name: "Eerste overwinning", icon: "⚔️", description: "Won je eerste live Schriftduel." },
];

async function main() {
  console.log("Seeding boeken, hoofdstukken, verzen en oefeningen (demo-inhoud)...");
  await importBooks(prisma, seedBooks);

  console.log("Seeding achievements...");
  for (const def of achievementDefs) {
    await prisma.achievement.upsert({
      where: { slug: def.slug },
      update: { name: def.name, icon: def.icon, description: def.description },
      create: def,
    });
  }

  // Demo-gebruikers (met een publiek bekend wachtwoord!) alleen aanmaken als dat
  // expliciet gevraagd wordt — dus NOOIT standaard op een productie-instantie.
  if (process.env.SEED_DEMO_USERS !== "true") {
    console.log("SEED_DEMO_USERS staat niet op 'true' — demo-gebruikers overgeslagen.");
    console.log("Seed klaar.");
    return;
  }

  // --- Demo-gebruikers zodat vrienden/competitie/live game meteen te testen zijn ---
  const demoPassword = await bcrypt.hash("demo1234", 10);
  const demoUsers = [
    { email: "anna@example.com", handle: "anna", discriminator: "00001", displayName: "Anna" },
    { email: "bram@example.com", handle: "bram", discriminator: "00001", displayName: "Bram" },
    { email: "carla@example.com", handle: "carla", discriminator: "00001", displayName: "Carla" },
  ];

  const createdUsers = [];
  for (const u of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { isDemoSeed: true },
      create: { ...u, passwordHash: demoPassword, isDemoSeed: true },
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

  console.log("Demo-gebruikers: anna#00001/bram#00001/carla#00001 (wachtwoord: demo1234)");
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
