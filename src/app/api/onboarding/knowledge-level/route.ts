import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { subscribeUserToCourse, INTRO_SLUG } from "@/lib/courses";

const schema = z.object({ level: z.enum(["NEVER", "SOME", "READ_BEFORE", "UNSURE"]) });

// Aangeroepen vanuit de nieuwe onboardingstap ("Hoeveel ken je het Boek van
// Mormon al?"). Bij "nog nooit"/"weet niet meer" wordt de introductiecursus
// automatisch aan de persoonlijke cursussenlijst toegevoegd (die staat door
// zijn Course.order al standaard bovenaan, zie syncCourses in
// src/lib/courses.ts) — bij de andere twee antwoorden verandert er niets,
// die cursus blijft gewoon beschikbaar in de catalogus.
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Ongeldige invoer" }, { status: 400 });

  await prisma.user.update({ where: { id: user.id }, data: { bomKnowledgeLevel: parsed.data.level } });

  if (parsed.data.level === "NEVER" || parsed.data.level === "UNSURE") {
    const introCourse = await prisma.course.findUnique({ where: { slug: INTRO_SLUG } });
    if (introCourse) await subscribeUserToCourse(prisma, user.id, introCourse.id);
  }

  return NextResponse.json({ ok: true });
}
