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
