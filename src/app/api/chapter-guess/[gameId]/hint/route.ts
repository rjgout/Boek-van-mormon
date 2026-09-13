import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { useChapterGuessHint } from "@/lib/chapterGuess";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ gameId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { gameId } = await params;
  const result = await useChapterGuessHint(gameId, user.id);
  if ("error" in result) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result);
}
