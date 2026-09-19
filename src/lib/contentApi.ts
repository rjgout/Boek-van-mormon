import { timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

/**
 * Sleutel-gebaseerde auth voor /api/content-api/* — los van de gewone
 * cookie-sessie (getCurrentUser), want dit is bedoeld voor server-naar-server
 * gebruik (bv. Claude Code dat live contentstatus checkt) zonder in te loggen.
 * Bewust alleen voor CONTENT: deze routes mogen nooit gebruikers- of
 * persoonsgegevens teruggeven, alleen boeken/hoofdstukken/oefeningen/
 * personages/podcastafleveringen e.d. — zie CLAUDE.md, sectie "Content-API".
 *
 * Geen env var gezet = de hele content-API staat uit (elk verzoek is
 * ongeautoriseerd), in plaats van per ongeluk open te staan zonder sleutel.
 */
export function verifyContentApiKey(req: NextRequest): boolean {
  const configured = process.env.CONTENT_API_KEY?.trim();
  if (!configured) return false;

  const provided = req.headers.get("x-api-key")?.trim();
  if (!provided) return false;

  // Constant-time vergelijking i.p.v. "===": voorkomt dat een aanvaller de
  // sleutel byte voor byte kan raden aan de hand van hoe snel het antwoord
  // terugkomt. Vereist gelijke lengte, dus eerst die check apart.
  const a = Buffer.from(configured);
  const b = Buffer.from(provided);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
