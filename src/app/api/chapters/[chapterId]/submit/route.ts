import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { isExerciseCorrect } from "@/lib/exerciseGen";
import { completeLesson } from "@/lib/streak";
import { advanceCourseProgress } from "@/lib/courses";
import { notifyNewAchievements } from "@/lib/notify";
import { recordChallengeAttempt } from "@/lib/challenges";

const schema = z.object({
  answers: z.array(
    z.object({
      exerciseId: z.string(),
      given: z.array(z.string()).min(1),
    })
  ),
  // Gezet als dit hoofdstuk gespeeld wordt als iemands beurt in een
  // uitdaging (zie /challenges) — de score telt dan ook mee daarvoor.
  challengeId: z.string().optional(),
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

  const exercises = await prisma.exercise.findMany({ where: { chapterId, status: "APPROVED" } });
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
    const correct = isExerciseCorrect(exercise.type, submitted.given, accepted);

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

  // Bewust het aantal daadwerkelijk beantwoorde oefeningen, niet het totale
  // aantal goedgekeurde oefeningen van dit hoofdstuk: de les toont een
  // willekeurige subset (zie lesson/[chapterId]/page.tsx), dus scorePercent
  // zou anders nooit 100% kunnen worden.
  const total = results.length;
  const scorePercent = total === 0 ? 0 : Math.round((correctCount / total) * 100);
  const xp = correctCount * XP_PER_CORRECT + (scorePercent === 100 ? XP_PERFECT_BONUS : 0);

  const lessonResult = await completeLesson(user.id, chapterId, scorePercent, xp);
  notifyNewAchievements(user.id, lessonResult.newAchievements).catch(() => {});

  if (parsed.data.challengeId) {
    await recordChallengeAttempt(user.id, parsed.data.challengeId, chapterId, scorePercent).catch(() => {});
  }

  // Zet de actieve cursus (indien van toepassing) een hoofdstuk verder —
  // no-op voor FREE_CHOICE, en ook als dit hoofdstuk niet bij die cursus hoort.
  if (user.activeCourseId) {
    await advanceCourseProgress(prisma, user.id, user.activeCourseId, chapterId);
  }

  return NextResponse.json({ results, correctCount, total, ...lessonResult });
}
