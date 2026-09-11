import { PrismaClient } from "@prisma/client";
import { runSeed } from "../src/lib/seed";

// Dunne CLI-ingang voor `npm run db:seed` — de eigenlijke logica staat in
// src/lib/seed.ts zodat de adminbackend (/api/admin/reseed) 'm ook
// in-process kan aanroepen zonder deze losse PrismaClient/process.exit-
// levenscyclus mee te importeren.
const prisma = new PrismaClient();

runSeed(prisma)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
