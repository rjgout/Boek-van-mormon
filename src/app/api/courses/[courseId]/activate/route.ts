import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { subscribeUserToCourse } from "@/lib/courses";

export async function POST(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { courseId } = await params;
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return NextResponse.json({ error: "Cursus niet gevonden" }, { status: 404 });

  await prisma.user.update({ where: { id: user.id }, data: { activeCourseId: courseId } });
  // Activeren voegt de cursus meteen ook toe aan de persoonlijke lijst (of
  // herstelt 'm daarin na eerder verwijderen) — zie CoursesClient.tsx, waar
  // "Kies deze cursus"/"Voeg toe" allebei op deze route uitkomen.
  await subscribeUserToCourse(prisma, user.id, courseId);

  return NextResponse.json({ ok: true });
}
