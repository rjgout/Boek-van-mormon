import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

interface ActivityItem {
  kind: "challenge" | "scrabble" | "live" | "chapter-guess-solo";
  id: string;
  opponentName: string | null;
  label: string;
  link: string;
  myTurn: boolean | null;
  // Alleen gezet bij kind "live": de speelcode, nodig om cancel_game te
  // kunnen versturen (zie ActiveGamesBanner) zonder eerst naar de lobby te
  // navigeren.
  code?: string;
}

// Alles wat een gebruiker "open" heeft staan over de asynchrone spellen
// heen (Uitdagingen, Woordspel), het realtime Live spel, en een eigen
// "Raad het hoofdstuk"-potje (alleen spelen) dat nog niet is uitgespeeld:
// openstaande uitnodigingen (ontvangen/verstuurd) en partijen die nog
// lopen. Gebruikt door ActiveGamesBanner bovenaan /live ("Spelen"), zodat
// je dat ook ziet zonder eerst de losse spelpagina's zelf te hoeven
// checken — en, voor het alleen-spelen-potje, zodat je terug kunt naar een
// spel waar je middenin zat na het navigeren naar een andere pagina (die
// URL zelf onthoud je anders nergens).
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const [challenges, scrabbleGames, liveGames, soloChapterGuessGames] = await Promise.all([
    prisma.challenge.findMany({
      where: { OR: [{ senderId: user.id }, { receiverId: user.id }], status: { in: ["PENDING", "ACCEPTED"] } },
      include: {
        sender: { select: { id: true, handle: true } },
        receiver: { select: { id: true, handle: true } },
        chapter: { include: { book: true } },
      },
    }),
    prisma.scrabbleGame.findMany({
      where: { OR: [{ player1Id: user.id }, { player2Id: user.id }], status: { in: ["PENDING", "ACTIVE"] } },
      include: {
        player1: { select: { id: true, handle: true } },
        player2: { select: { id: true, handle: true } },
      },
    }),
    prisma.liveGame.findMany({
      where: {
        status: { in: ["LOBBY", "IN_PROGRESS"] },
        OR: [{ hostId: user.id }, { players: { some: { userId: user.id } } }],
      },
      include: {
        chapter: { include: { book: true } },
        players: { select: { userId: true } },
        invites: { include: { user: { select: { handle: true } } } },
      },
    }),
    prisma.chapterGuessGame.findMany({
      where: { userId: user.id, status: "IN_PROGRESS" },
      orderBy: { createdAt: "desc" },
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
        opponentName: opponent.handle,
        label,
        link: "/challenges",
        myTurn: null,
      });
    } else {
      const myCompletedAt = isSender ? c.senderCompletedAt : c.receiverCompletedAt;
      activeGames.push({
        kind: "challenge",
        id: c.id,
        opponentName: opponent.handle,
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
        opponentName: opponent.handle,
        label: "Woordspel",
        link: "/scrabble",
        myTurn: null,
      });
    } else {
      activeGames.push({
        kind: "scrabble",
        id: g.id,
        opponentName: opponent.handle,
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

    // Een lobby waar verder niemand op gereageerd/meegedaan heeft (net
    // aangemaakt, of uitgenodigd maar nog geen reactie) is geen "sessie die
    // je verder kan doen" — die staat de host toch al zelf op te kijken.
    // Pas zodra er een uitnodiging openstaat, tonen we 'm (als "wachten op
    // reactie", met een manier om 'm te beëindigen); zodra iemand echt is
    // toegetreden is het een volwaardige actieve sessie, ongeacht status.
    const joinedUserIds = new Set(lg.players.map((p) => p.userId));
    if (lg.status === "LOBBY" && joinedUserIds.size <= 1) {
      if (lg.hostId !== user.id) continue; // kan niet voorkomen gezien de WHERE hierboven, maar voor de zekerheid
      for (const invite of lg.invites) {
        if (joinedUserIds.has(invite.userId)) continue;
        invitesSent.push({
          kind: "live",
          id: lg.id,
          opponentName: invite.user.handle,
          label,
          link: `/live/${lg.code}`,
          myTurn: null,
          code: lg.code,
        });
      }
      continue;
    }

    activeGames.push({
      kind: "live",
      id: lg.id,
      opponentName: null,
      label,
      link: `/live/${lg.code}`,
      myTurn: null,
      code: lg.code,
    });
  }

  const LEVEL_LABELS: Record<string, string> = { BEGINNER: "Beginner", ADVANCED: "Gevorderd", EXPERT: "Expert" };
  for (const g of soloChapterGuessGames) {
    activeGames.push({
      kind: "chapter-guess-solo",
      id: g.id,
      opponentName: null,
      label: `Raad het hoofdstuk (${LEVEL_LABELS[g.level]}) — vraag ${g.currentIndex + 1}/${g.questionCount}`,
      link: `/chapter-guess/solo/${g.id}`,
      myTurn: null,
    });
  }

  return NextResponse.json({ invitesReceived, invitesSent, activeGames });
}
