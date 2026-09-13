import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

interface ActivityItem {
  kind: "challenge" | "scrabble" | "live";
  id: string;
  opponentName: string | null;
  label: string;
  link: string;
  myTurn: boolean | null;
}

// Alles wat een gebruiker "open" heeft staan over de asynchrone spellen
// heen (Uitdagingen, Woordspel) en het realtime Live spel: openstaande
// uitnodigingen (ontvangen/verstuurd) en partijen die nog lopen. Gebruikt
// door ActiveGamesBanner op /dashboard en /courses, zodat je dat ook ziet
// zonder eerst naar de spelpagina's zelf te gaan.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const [challenges, scrabbleGames, liveGames] = await Promise.all([
    prisma.challenge.findMany({
      where: { OR: [{ senderId: user.id }, { receiverId: user.id }], status: { in: ["PENDING", "ACCEPTED"] } },
      include: {
        sender: { select: { id: true, displayName: true } },
        receiver: { select: { id: true, displayName: true } },
        chapter: { include: { book: true } },
      },
    }),
    prisma.scrabbleGame.findMany({
      where: { OR: [{ player1Id: user.id }, { player2Id: user.id }], status: { in: ["PENDING", "ACTIVE"] } },
      include: {
        player1: { select: { id: true, displayName: true } },
        player2: { select: { id: true, displayName: true } },
      },
    }),
    prisma.liveGame.findMany({
      where: {
        status: { in: ["LOBBY", "IN_PROGRESS"] },
        OR: [{ hostId: user.id }, { players: { some: { userId: user.id } } }],
      },
      include: { chapter: { include: { book: true } } },
    }),
  ]);

  const invitesReceived: ActivityItem[] = [];
  const invitesSent: ActivityItem[] = [];
  const activeGames: ActivityItem[] = [];

  for (const c of challenges) {
    const isSender = c.senderId === user.id;
    const opponent = isSender ? c.receiver : c.sender;
    const label = `${c.chapter.book.name} ${c.chapter.number}`;
    if (c.status === "PENDING") {
      (isSender ? invitesSent : invitesReceived).push({
        kind: "challenge",
        id: c.id,
        opponentName: opponent.displayName,
        label,
        link: "/challenges",
        myTurn: null,
      });
    } else {
      const myCompletedAt = isSender ? c.senderCompletedAt : c.receiverCompletedAt;
      activeGames.push({
        kind: "challenge",
        id: c.id,
        opponentName: opponent.displayName,
        label,
        link: "/challenges",
        myTurn: myCompletedAt === null,
      });
    }
  }

  for (const g of scrabbleGames) {
    const isPlayer1 = g.player1Id === user.id;
    const opponent = isPlayer1 ? g.player2 : g.player1;
    if (g.status === "PENDING") {
      (isPlayer1 ? invitesSent : invitesReceived).push({
        kind: "scrabble",
        id: g.id,
        opponentName: opponent.displayName,
        label: "Woordspel",
        link: "/scrabble",
        myTurn: null,
      });
    } else {
      activeGames.push({
        kind: "scrabble",
        id: g.id,
        opponentName: opponent.displayName,
        label: "Woordspel",
        link: `/scrabble/${g.id}`,
        myTurn: g.turnUserId === user.id,
      });
    }
  }

  for (const lg of liveGames) {
    const suffix = lg.status === "LOBBY" ? " (lobby)" : "";
    const label =
      lg.mode === "CHAPTER_GUESS"
        ? `Live spel — Raad het hoofdstuk${suffix}`
        : `Live spel — ${lg.chapter?.book.name} ${lg.chapter?.number}${suffix}`;
    activeGames.push({
      kind: "live",
      id: lg.id,
      opponentName: null,
      label,
      link: `/live/${lg.code}`,
      myTurn: null,
    });
  }

  return NextResponse.json({ invitesReceived, invitesSent, activeGames });
}
