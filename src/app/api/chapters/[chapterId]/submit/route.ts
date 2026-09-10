import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { isAnswerCorrect, isWordBankCorrect } from "@/lib/exerciseGen";
import { completeLesson } from "@/lib/streak";

const schema = z.object({
  answers: z.array(
    z.object({
      exerciseId: z.string(),
      given: z.array(z.string()).min(1),
    })
  ),
});

const XP_PER_CORRECT = 10;
const XP_PERFECT_BONUS = 20;

export async function POST(req: NextRequest, { params }: { params: Promise<{ chapterId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { chapterId } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ongeldige invoer" }, { status: 400 });
  }

  const exercises = await prisma.exercise.findMany({ where: { chapterId } });
  if (exercises.length === 0) {
    return NextResponse.json({ error: "Hoofdstuk niet gevonden" }, { status: 404 });
  }
  const exerciseById = new Map(exercises.map((e) => [e.id, e]));

  let correctCount = 0;
  const results: { exerciseId: string; correct: boolean; correctAnswer: string[] }[] = [];

  for (const submitted of parsed.data.answers) {
    const exercise = exerciseById.get(submitted.exerciseId);
    if (!exercise || exercise.chapterId !== chapterId) continue;

    const accepted = JSON.parse(exercise.answers) as string[];
    const correct =
      exercise.type === "WORD_BANK"
        ? isWordBankCorrect(submitted.given, accepted)
        : isAnswerCorrect(submitted.given[0] ?? "", accepted);

    if (correct) correctCount++;
    results.push({ exerciseId: exercise.id, correct, correctAnswer: accepted });

    await prisma.exerciseAttempt.create({
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
  const xp = correctCount * XP_PER_CORRECT + (scorePercent === 100 ? XP_PERFECT_BONUS : 0);

  const lessonResult = await completeLesson(user.id, chapterId, scorePercent, xp);

  return NextResponse.json({ results, correctCount, total, ...lessonResult });
}
