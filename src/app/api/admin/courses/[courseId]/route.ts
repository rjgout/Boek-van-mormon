import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

const schema = z.object({ enabled: z.boolean() });

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  if (!user.isAdmin) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

  const { courseId } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Ongeldige invoer" }, { status: 400 });

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return NextResponse.json({ error: "Cursus niet gevonden" }, { status: 404 });

  await prisma.course.update({ where: { id: courseId }, data: { enabled: parsed.data.enabled } });
  return NextResponse.json({ ok: true });
}
