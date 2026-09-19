import { NextRequest, NextResponse } from "next/server";
import { verifyContentApiKey } from "@/lib/contentApi";
import { runOfficialContentImport } from "@/lib/officialContentImport";

/**
 * Triggert handmatig een importronde (zie officialContentImport.ts) i.p.v. te
 * wachten op de dagelijkse scheduler-tick — o.a. bedoeld voor Claude Code om
 * op verzoek te checken of er nieuwe/gewijzigde content klaarstaat. Draait
 * synchroon (self-hosted, persistente Node-server, geen platform-timeout
 * zoals bij serverless) en geeft de volledige samenvatting terug.
 */
export async function POST(req: NextRequest) {
  if (!verifyContentApiKey(req)) {
    return NextResponse.json({ error: "Ongeldige of ontbrekende API-sleutel." }, { status: 401 });
  }

  const summary = await runOfficialContentImport("api");
  return NextResponse.json({ ok: true, summary });
}
