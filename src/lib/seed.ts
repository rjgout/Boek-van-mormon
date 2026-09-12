import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedBooks } from "../../prisma/content";
import { importBooks } from "../../prisma/importContent";
import { podcastEpisodes } from "../../prisma/podcastContent";
import { importPodcastEpisodes } from "../../prisma/importPodcast";
import { syncPodcastFeed } from "./podcastFeed";
import { importKidsStories, type KidsStorySeed } from "../../prisma/importKids";
import kidsManifest from "../../prisma/kidsManifest.json";

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

/**
 * De volledige seed-routine — herbruikbaar vanaf de CLI (`npm run db:seed`,
 * zie prisma/seed.ts) én vanuit de adminbackend (zie `/api/admin/reseed`),
 * die deze in-process aanroept met de gedeelde Prisma-client van de app in
 * plaats van er zelf een nieuwe voor op te zetten. `log` is injecteerbaar
 * zodat de adminbackend de voortgangsregels kan opvangen en teruggeven aan
 * de admin, in plaats van dat ze alleen in de containerlogs verdwijnen.
 */
export async function runSeed(client: PrismaClient, log: (msg: string) => void = console.log): Promise<void> {
  log("Seeding boeken, hoofdstukken, verzen en oefeningen (demo-inhoud)...");
  await importBooks(client, seedBooks, log);

  log("Seeding podcastafleveringen...");
  await importPodcastEpisodes(client, podcastEpisodes, log);

  log("Podcastfeed ophalen voor titels/omschrijvingen en nieuwe afleveringen...");
  await syncPodcastFeed(client, log);

  log("Seeding kindercursus (Verhalen uit het Boek van Mormon)...");
  await importKidsStories(client, kidsManifest as KidsStorySeed[], log);

  log("Seeding achievements...");
  for (const def of achievementDefs) {
    await client.achievement.upsert({
      where: { slug: def.slug },
      update: { name: def.name, icon: def.icon, description: def.description },
      create: def,
    });
  }

  // Demo-gebruikers (met een publiek bekend wachtwoord!) alleen aanmaken als dat
  // expliciet gevraagd wordt — dus NOOIT standaard op een productie-instantie.
  if (process.env.SEED_DEMO_USERS !== "true") {
    log("SEED_DEMO_USERS staat niet op 'true' — demo-gebruikers overgeslagen.");
    log("Seed klaar.");
    return;
  }

  // --- Demo-gebruikers zodat vrienden/competitie/live game meteen te testen zijn ---
  const demoPassword = await bcrypt.hash("demo1234", 10);
  const demoUsers = [
    { email: "anna@example.com", handle: "anna", discriminator: "01", displayName: "Anna" },
    { email: "bram@example.com", handle: "bram", discriminator: "01", displayName: "Bram" },
    { email: "carla@example.com", handle: "carla", discriminator: "01", displayName: "Carla" },
  ];

  const createdUsers = [];
  for (const u of demoUsers) {
    const user = await client.user.upsert({
      where: { email: u.email },
      update: { isDemoSeed: true },
      create: { ...u, passwordHash: demoPassword, isDemoSeed: true },
    });
    createdUsers.push(user);
  }

  const [anna, bram, carla] = createdUsers;
  await client.friendship.upsert({
    where: { senderId_receiverId: { senderId: anna.id, receiverId: bram.id } },
    update: { status: "ACCEPTED" },
    create: { senderId: anna.id, receiverId: bram.id, status: "ACCEPTED" },
  });
  await client.friendship.upsert({
    where: { senderId_receiverId: { senderId: carla.id, receiverId: anna.id } },
    update: { status: "PENDING" },
    create: { senderId: carla.id, receiverId: anna.id, status: "PENDING" },
  });

  log("Demo-gebruikers: anna#01/bram#01/carla#01 (wachtwoord: demo1234)");
  log("Seed klaar.");
}
