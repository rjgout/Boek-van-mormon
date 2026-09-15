import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

// Verwijdert een cursus uit de persoonlijke cursussenlijst — de
// UserCourseProgress-rij (dus de voortgang) blijft gewoon bestaan, alleen
// subscribed wordt false; opnieuw toevoegen (zie subscribeUserToCourse) zet
// 'm terug aan en je staat weer precies waar je was.
export async function POST(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { courseId } = await params;
  const result = await prisma.userCourseProgress.updateMany({
    where: { userId: user.id, courseId },
    data: { subscribed: false },
  });
  if (result.count === 0) {
    return NextResponse.json({ error: "Deze cursus stond niet in je lijst." }, { status: 404 });
  }

  if (user.activeCourseId === courseId) {
    await prisma.user.update({ where: { id: user.id }, data: { activeCourseId: null } });
  }

  return NextResponse.json({ ok: true });
}
