import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { forfeitChallenge } from "@/lib/challenges";

export async function POST(_req: Request, { params }: { params: Promise<{ challengeId: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { challengeId } = await params;
  const result = await forfeitChallenge(user.id, challengeId);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ ok: true });
}
