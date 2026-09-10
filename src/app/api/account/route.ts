import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { SESSION_COOKIE } from "@/lib/auth";

const patchSchema = z.object({ searchableByEmail: z.boolean() });

// Privacy-instelling: standaard uit. Alleen als een gebruiker dit zelf
// aanzet, kan zijn/haar exacte e-mailadres gebruikt worden om diegene te
// vinden bij het toevoegen van vrienden (zie /api/users/search).
export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Ongeldige invoer" }, { status: 400 });

  await prisma.user.update({
    where: { id: user.id },
    data: { searchableByEmail: parsed.data.searchableByEmail },
  });
  return NextResponse.json({ ok: true });
}

// AVG: een gebruiker moet zijn account (en alle bijbehorende gegevens)
// kunnen verwijderen. Alle relaties naar User staan op onDelete: Cascade
// (of SetNull voor freeze-gift-verwijzingen), dus dit verwijdert ook
// voortgang, XP-historie, vriendschappen, quizresultaten en meer.
export async function DELETE() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  await prisma.user.delete({ where: { id: user.id } });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
