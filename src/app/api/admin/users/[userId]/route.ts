import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

const schema = z.object({ isAdmin: z.boolean() });

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  if (!user.isAdmin) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

  const { userId } = await params;
  // Voorkomt dat een admin zichzelf per ongeluk buitensluit — adminrechten
  // afpakken moet altijd door een ándere admin gebeuren.
  if (userId === user.id) {
    return NextResponse.json({ error: "Je kan je eigen adminrechten niet aanpassen." }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ongeldige invoer" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) return NextResponse.json({ error: "Gebruiker niet gevonden" }, { status: 404 });

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isAdmin: parsed.data.isAdmin },
    select: { id: true, isAdmin: true },
  });

  return NextResponse.json(updated);
}

// Alle relaties naar User staan op onDelete: Cascade (of SetNull voor
// freeze-gift-verwijzingen) — zie ook DELETE /api/account, waar een
// gebruiker zichzelf op dezelfde manier verwijdert. Dit verwijdert dus ook
// voortgang, XP-historie, vriendschappen, spellen en meer van de gekozen
// gebruiker.
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  if (!user.isAdmin) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

  const { userId } = await params;
  if (userId === user.id) {
    return NextResponse.json({ error: "Je kan jezelf niet verwijderen — vraag een andere admin." }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) return NextResponse.json({ error: "Gebruiker niet gevonden" }, { status: 404 });

  await prisma.user.delete({ where: { id: userId } });

  return NextResponse.json({ ok: true });
}
