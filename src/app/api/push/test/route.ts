import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { sendPushToUser } from "@/lib/push";

// Laat iemand direct checken of pushmeldingen op dit apparaat aankomen,
// zonder te moeten wachten op een echte gebeurtenis (vriendschapsverzoek,
// dagelijkse herinnering, ...) — zelfde gedachte als "Testmail versturen"
// bij de e-mailinstellingen.
export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const count = await prisma.pushSubscription.count({ where: { userId: user.id } });
  if (count === 0) {
    return NextResponse.json(
      { error: "Geen actieve pushsubscriptie gevonden. Zet pushmeldingen hierboven aan." },
      { status: 400 }
    );
  }

  await sendPushToUser(user.id, {
    title: "Testmelding 🔔",
    body: "Als je dit ziet, werken pushmeldingen op dit apparaat!",
    url: "/profile",
  });

  return NextResponse.json({ ok: true });
}
