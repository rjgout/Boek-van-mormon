import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { HINT_PRICE_XP, FREEZE_PRICE_XP } from "@/lib/shop";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  return NextResponse.json({
    xpTotal: user.xpTotal,
    hintBalance: user.hintBalance,
    hintPriceXp: HINT_PRICE_XP,
    freezeCount: user.freezeCount,
    freezePriceXp: FREEZE_PRICE_XP,
  });
}
