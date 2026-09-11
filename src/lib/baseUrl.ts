import type { NextRequest } from "next/server";

/**
 * Bouwt de publieke basis-URL voor links in e-mails (bevestiging, reset).
 * Self-hosted en zonder vast domein bekend op de server, dus bij voorkeur
 * APP_URL (env, bv. https://bom.jouwdomein.nl) — anders afgeleid van de
 * binnenkomende request (werkt ook automatisch achter een reverse proxy/
 * Cloudflare Tunnel die X-Forwarded-* meestuurt).
 */
export function getBaseUrl(req: NextRequest): string {
  const configured = process.env.APP_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  const proto = req.headers.get("x-forwarded-proto") ?? req.nextUrl.protocol.replace(":", "");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? req.nextUrl.host;
  return `${proto}://${host}`;
}

/**
 * Zelfde basis-URL, maar bruikbaar buiten een request-context (bv. de
 * in-process notificatie-schedulers in src/lib/scheduler.ts, die geen
 * inkomend request hebben om van af te leiden). Vereist dus APP_URL in de
 * omgeving om een klikbare link te geven; zonder dat valt terug op
 * localhost, wat in een e-mail/pushnotificatie niet aanklikbaar is maar de
 * rest van het bericht niet in de weg zit.
 */
export function getAppUrl(): string {
  const configured = process.env.APP_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");
  return `http://localhost:${process.env.PORT ?? "3000"}`;
}
