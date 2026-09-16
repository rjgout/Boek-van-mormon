import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { HINT_PRICE_XP, FREEZE_PRICE_XP, getTotalHintBalance } from "@/lib/shop";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  return NextResponse.json({
    xpTotal: user.xpTotal,
    // Incl. per-partij verdiende tegoeden van lopende potjes, zodat dit
    // getal altijd overeenkomt met wat je in zo'n potje zelf ziet staan.
    hintBalance: await getTotalHintBalance(user.id),
    hintPriceXp: HINT_PRICE_XP,
    freezeCount: user.freezeCount,
    freezePriceXp: FREEZE_PRICE_XP,
  });
}
