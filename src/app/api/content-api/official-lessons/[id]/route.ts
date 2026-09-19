import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyContentApiKey } from "@/lib/contentApi";

/** Eén geïmporteerde les inclusief de volledige, ongewijzigde bron-HTML. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyContentApiKey(req)) {
    return NextResponse.json({ error: "Ongeldige of ontbrekende API-sleutel." }, { status: 401 });
  }

  const { id } = await params;
  const lesson = await prisma.importedOfficialLesson.findUnique({ where: { id } });
  if (!lesson) return NextResponse.json({ error: "Niet gevonden." }, { status: 404 });

  return NextResponse.json({ ok: true, lesson });
}
