import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

const SINGLETON_ID = "singleton";
const LOCAL_HOST_RE = /^(localhost|127\.0\.0\.1|\[::1\])(:|$)/;

/**
 * Onthoudt het gedetecteerde adres voor achtergrondprocessen zonder eigen
 * request (zie getAppUrl hieronder) — fire-and-forget, mag nooit een verzoek
 * vertragen/breken. Een lokaal adres wordt bewust nooit gecachet: anders zou
 * een ontwikkelaar die de app op localhost bezoekt de echte, productie-URL
 * in de cache overschrijven.
 *
 * Bewust GEEN "next/headers"-import in dit bestand (ook niet voor de
 * layout.tsx-aanroeper hieronder, zie cacheDetectedAppUrl daar): server.ts
 * (draait rechtstreeks via tsx, buiten Next's eigen module-bundeling om)
 * importeert bij het opstarten al gameServer.ts en scheduler.ts, die via
 * notify.ts dit bestand meenemen — vóórdat Next zelf ("app.prepare()") is
 * geïnitialiseerd. Een echte "next/headers"-import in die keten laat Next's
 * server-runtime meteen crashen ("AsyncLocalStorage accessed in runtime
 * where it is not available"), zoals in productie ook daadwerkelijk gebeurde.
 */
export function cacheDetectedAppUrl(url: string, host: string): void {
  if (LOCAL_HOST_RE.test(host)) return;
  prisma.detectedAppUrl.upsert({ where: { id: SINGLETON_ID }, create: { id: SINGLETON_ID, url }, update: { url } }).catch(() => {});
}

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
  const url = `${proto}://${host}`;
  cacheDetectedAppUrl(url, host);
  return url;
}

/**
 * Zelfde basis-URL, maar bruikbaar buiten een request-context (bv. de
 * in-process notificatie-schedulers in src/lib/scheduler.ts en de
 * socket.io-spelserver, die geen inkomend request hebben om van af te
 * leiden). Volgorde: expliciete APP_URL-override → het laatst gedetecteerde
 * publieke adres (zie cacheDetectedAppUrl hierboven, bijgehouden vanuit zowel
 * getBaseUrl als layout.tsx) → localhost als allerlaatste terugval.
 */
export async function getAppUrl(): Promise<string> {
  const configured = process.env.APP_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  const cached = await prisma.detectedAppUrl.findUnique({ where: { id: SINGLETON_ID } }).catch(() => null);
  if (cached?.url) return cached.url;

  return `http://localhost:${process.env.PORT ?? "3000"}`;
}
