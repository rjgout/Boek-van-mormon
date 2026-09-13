import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function GET(_req: Request, { params }: { params: Promise<{ gameId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { gameId } = await params;
  const game = await prisma.scrabbleGame.findUnique({
    where: { id: gameId },
    include: {
      player1: { select: { id: true, displayName: true } },
      player2: { select: { id: true, displayName: true } },
      moves: { orderBy: { createdAt: "asc" }, include: { user: { select: { displayName: true } } } },
    },
  });
  if (!game || (game.player1Id !== user.id && game.player2Id !== user.id)) {
    return NextResponse.json({ error: "Spel niet gevonden." }, { status: 404 });
  }

  const isPlayer1 = game.player1Id === user.id;
  const opponent = isPlayer1 ? game.player2 : game.player1;
  const myRack: string[] = JSON.parse(isPlayer1 ? game.player1Rack : game.player2Rack);
  const opponentRack: string[] = JSON.parse(isPlayer1 ? game.player2Rack : game.player1Rack);
  const bag: string[] = JSON.parse(game.bag);

  return NextResponse.json({
    id: game.id,
    status: game.status,
    board: JSON.parse(game.board),
    myRack,
    // De letters van de tegenstander blijven bewust geheim — alleen het
    // aantal, zodat je wél kunt zien hoeveel die nog moet spelen.
    opponentRackCount: opponentRack.length,
    bagCount: bag.length,
    myScore: isPlayer1 ? game.player1Score : game.player2Score,
    opponentScore: isPlayer1 ? game.player2Score : game.player1Score,
    myHintCredits: isPlayer1 ? game.player1HintCredits : game.player2HintCredits,
    isMyTurn: game.status === "ACTIVE" && game.turnUserId === user.id,
    opponent: { id: opponent.id, displayName: opponent.displayName },
    won: game.status === "FINISHED" ? game.winnerUserId === user.id : null,
    tied: game.status === "FINISHED" ? game.winnerUserId === null : null,
    moves: game.moves.map((m) => ({
      id: m.id,
      playerName: m.user.displayName,
      isMine: m.userId === user.id,
      type: m.type,
      wordsFormed: m.wordsFormed ? (JSON.parse(m.wordsFormed) as string[]) : [],
      score: m.score,
      createdAt: m.createdAt,
    })),
  });
}
