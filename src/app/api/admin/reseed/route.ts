import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { runSeed } from "@/lib/seed";

// Admin-versie van `npm run db:seed`: laadt content (boeken/hoofdstukken/
// oefeningen, podcastafleveringen, achievements) opnieuw in, zonder dat de
// admin daarvoor een terminal op de NAS hoeft te openen. Draait in-process
// met de gedeelde Prisma-client — geen losse container-exec nodig.
export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  if (!user.isAdmin) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

  const logs: string[] = [];
  try {
    await runSeed(prisma, (msg) => logs.push(msg));
    return NextResponse.json({ ok: true, logs });
  } catch (e) {
    logs.push(e instanceof Error ? e.message : String(e));
    return NextResponse.json({ error: "Content laden is mislukt.", logs }, { status: 500 });
  }
}
