import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  return NextResponse.json({
    id: user.id,
    handle: user.handle,
    discriminator: user.discriminator,
    displayName: user.displayName,
    xpTotal: user.xpTotal,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    freezeCount: user.freezeCount,
  });
}
