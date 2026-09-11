import { prisma } from "@/lib/db";
import { notifyChallengeYourTurn, notifyChallengeFinished } from "@/lib/notify";

/**
 * Verwerkt een les-score als beurt in een uitdaging, indien de speler er
 * één opgaf bij het afronden van een hoofdstuk (zie LessonFlow/lesson-
 * pagina en /api/chapters/[chapterId]/submit). Bewust los van completeLesson
 * — een uitdaging is puur een score-vergelijking, geen eigen
 * voortgang/streak/XP-bron.
 */
export async function recordChallengeAttempt(userId: string, challengeId: string, chapterId: string, scorePercent: number): Promise<void> {
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: { sender: true, receiver: true },
  });
  if (!challenge) return;
  if (challenge.chapterId !== chapterId) return;
  if (challenge.status !== "ACCEPTED") return;

  const isSender = challenge.senderId === userId;
  const isReceiver = challenge.receiverId === userId;
  if (!isSender && !isReceiver) return;

  if (isSender && challenge.senderCompletedAt) return; // al gespeeld, geen herkansing
  if (isReceiver && challenge.receiverCompletedAt) return;

  const opponentAlreadyPlayed = isSender ? challenge.receiverCompletedAt !== null : challenge.senderCompletedAt !== null;

  const updated = await prisma.challenge.update({
    where: { id: challengeId },
    data: isSender
      ? { senderScore: scorePercent, senderCompletedAt: new Date() }
      : { receiverScore: scorePercent, receiverCompletedAt: new Date() },
  });

  if (opponentAlreadyPlayed) {
    await prisma.challenge.update({ where: { id: challengeId }, data: { status: "FINISHED" } });
    const senderScore = updated.senderScore ?? 0;
    const receiverScore = updated.receiverScore ?? scorePercent;
    const tied = senderScore === receiverScore;
    await Promise.allSettled([
      notifyChallengeFinished(challenge.senderId, challenge.receiver.displayName, senderScore > receiverScore, tied),
      notifyChallengeFinished(challenge.receiverId, challenge.sender.displayName, receiverScore > senderScore, tied),
    ]);
  } else {
    const opponentId = isSender ? challenge.receiverId : challenge.senderId;
    const playerName = isSender ? challenge.sender.displayName : challenge.receiver.displayName;
    await notifyChallengeYourTurn(opponentId, playerName).catch(() => {});
  }
}
