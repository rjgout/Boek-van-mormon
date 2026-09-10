import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { SESSION_COOKIE } from "@/lib/auth";

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
