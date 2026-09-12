import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

const schema = z.object({ status: z.enum(["NEW", "IN_PROGRESS", "DONE", "WONT_DO"]) });

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ feedbackId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  if (!user.isAdmin) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

  const { feedbackId } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Ongeldige invoer" }, { status: 400 });

  const feedback = await prisma.feedback.findUnique({ where: { id: feedbackId } });
  if (!feedback) return NextResponse.json({ error: "Melding niet gevonden." }, { status: 404 });

  await prisma.feedback.update({ where: { id: feedbackId }, data: { status: parsed.data.status } });
  return NextResponse.json({ ok: true });
}
