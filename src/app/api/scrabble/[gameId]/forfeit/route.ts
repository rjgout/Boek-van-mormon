import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { forfeitGame } from "@/lib/scrabbleGame";

export async function POST(_req: Request, { params }: { params: Promise<{ gameId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { gameId } = await params;
  const result = await forfeitGame(gameId, user.id);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ ok: true });
}
