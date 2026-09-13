import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { notifyChallengeReceived } from "@/lib/notify";

const createSchema = z.object({
  friendUserId: z.string().trim().min(1),
  chapterId: z.string().trim().min(1),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const challenges = await prisma.challenge.findMany({
    where: { OR: [{ senderId: user.id }, { receiverId: user.id }] },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, displayName: true, handle: true, discriminator: true } },
      receiver: { select: { id: true, displayName: true, handle: true, discriminator: true } },
      chapter: { include: { book: true } },
    },
  });

  return NextResponse.json({
    challenges: challenges.map((c) => {
      const isSender = c.senderId === user.id;
      const opponent = isSender ? c.receiver : c.sender;
      const myScore = isSender ? c.senderScore : c.receiverScore;
      const opponentScore = isSender ? c.receiverScore : c.senderScore;
      const myCompletedAt = isSender ? c.senderCompletedAt : c.receiverCompletedAt;
      return {
        id: c.id,
        status: c.status,
        isSender,
        bookName: c.chapter.book.name,
        chapterNumber: c.chapter.number,
        chapterId: c.chapterId,
        opponent: { id: opponent.id, displayName: opponent.displayName },
        myScore,
        opponentScore,
        hasPlayed: myCompletedAt !== null,
        won: c.status === "FINISHED" ? c.winnerUserId === user.id : null,
        tied: c.status === "FINISHED" ? c.winnerUserId === null : null,
        createdAt: c.createdAt,
      };
    }),
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Ongeldige invoer" }, { status: 400 });
  const { friendUserId, chapterId } = parsed.data;

  if (friendUserId === user.id) {
    return NextResponse.json({ error: "Je kan jezelf niet uitdagen." }, { status: 400 });
  }

  const friendship = await prisma.friendship.findFirst({
    where: {
      status: "ACCEPTED",
      OR: [
        { senderId: user.id, receiverId: friendUserId },
        { senderId: friendUserId, receiverId: user.id },
      ],
    },
  });
  if (!friendship) {
    return NextResponse.json({ error: "Je kan alleen vrienden uitdagen." }, { status: 400 });
  }

  const chapter = await prisma.chapter.findUnique({ where: { id: chapterId }, include: { book: true } });
  if (!chapter) return NextResponse.json({ error: "Hoofdstuk niet gevonden." }, { status: 404 });

  const challenge = await prisma.challenge.create({
    data: { senderId: user.id, receiverId: friendUserId, chapterId, status: "PENDING" },
  });

  notifyChallengeReceived(friendUserId, user.displayName, chapter.book.name, chapter.number).catch(() => {});

  return NextResponse.json({ id: challenge.id });
}
