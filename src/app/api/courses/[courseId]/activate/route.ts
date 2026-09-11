import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { advanceCourseProgress } from "@/lib/courses";

export async function POST(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { courseId } = await params;
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return NextResponse.json({ error: "Cursus niet gevonden" }, { status: 404 });

  await prisma.user.update({ where: { id: user.id }, data: { activeCourseId: courseId } });

  // Zorgt dat een cursus die je voor het eerst kiest meteen een eerste
  // hoofdstuk klaar heeft staan i.p.v. leeg te zijn tot je iets voltooit.
  const existingProgress = await prisma.userCourseProgress.findUnique({
    where: { userId_courseId: { userId: user.id, courseId } },
  });
  if (!existingProgress && course.type !== "FREE_CHOICE") {
    await advanceCourseProgress(prisma, user.id, courseId);
  }

  return NextResponse.json({ ok: true });
}
