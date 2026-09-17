import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { isExerciseCorrect } from "@/lib/exerciseGen";
import { completeIntroLesson } from "@/lib/streak";
import { notifyNewAchievements } from "@/lib/notify";
import { standardContentXp } from "@/lib/xpRules";

const schema = z.object({
  answers: z.array(
    z.object({
      exerciseId: z.string(),
      given: z.array(z.string()).min(1),
    })
  ),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ lessonId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { lessonId } = await params;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ongeldige invoer" }, { status: 400 });
  }

  const exercises = await prisma.introExercise.findMany({ where: { lessonId } });
  if (exercises.length === 0) {
    return NextResponse.json({ error: "Les niet gevonden" }, { status: 404 });
  }
  const exerciseById = new Map(exercises.map((e) => [e.id, e]));

  let correctCount = 0;
  const results: { exerciseId: string; correct: boolean; correctAnswer: string[] }[] = [];

  for (const submitted of parsed.data.answers) {
    const exercise = exerciseById.get(submitted.exerciseId);
    if (!exercise || exercise.lessonId !== lessonId) continue;

    const accepted = JSON.parse(exercise.answers) as string[];
    const correct = isExerciseCorrect(exercise.type, submitted.given, accepted);

    if (correct) correctCount++;
    results.push({ exerciseId: exercise.id, correct, correctAnswer: accepted });

    await prisma.introExerciseAttempt.create({
      data: {
        userId: user.id,
        exerciseId: exercise.id,
        givenText: submitted.given.join(" "),
        correct,
      },
    });
  }

  const total = exercises.length;
  const scorePercent = total === 0 ? 0 : Math.round((correctCount / total) * 100);
  const xp = standardContentXp(correctCount, total);

  const lessonResult = await completeIntroLesson(user.id, lessonId, scorePercent, xp);
  notifyNewAchievements(user.id, lessonResult.newAchievements).catch(() => {});

  return NextResponse.json({ results, correctCount, total, ...lessonResult });
}
