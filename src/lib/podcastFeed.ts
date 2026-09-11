import Parser from "rss-parser";
import type { PrismaClient } from "@prisma/client";

// Overschrijfbaar via env var voor het geval de feed-URL ooit verhuist,
// zonder dat daarvoor een code-wijziging nodig is.
const FEED_URL = process.env.PODCAST_FEED_URL || "https://geloofjedatook.nl/@geloofjedatook/feed.xml";

interface FeedItem {
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
  content?: string;
  contentSnippet?: string;
  summary?: string;
  enclosure?: { url: string; length?: number; type?: string };
  "itunes:episode"?: string;
  "itunes:summary"?: string;
}

const FETCH_TIMEOUT_MS = 10_000;

// We halen de XML zelf op met de ingebouwde fetch() (met een harde
// AbortSignal-timeout) en geven de tekst aan parseString() door, in plaats
// van rss-parser's eigen parseURL() te gebruiken — die leunt op een oudere
// http(s)-clientlaag waarvan de eigen timeout-optie niet betrouwbaar bleek
// bij een hangende/geblokkeerde verbinding. Zonder een harde timeout kan een
// onbereikbare feed-server db:seed (en dus ook de adminbackend-knop) voor
// onbepaalde tijd laten hangen — dit is een aanvulling die nooit de rest van
// de content-import mag blokkeren.
const parser = new Parser<Record<string, unknown>, FeedItem>({
  customFields: {
    item: ["itunes:episode", "itunes:summary"],
  },
});

async function fetchFeedXml(url: string): Promise<string> {
  // Sommige feed-hosts weigeren requests zonder (herkenbare) User-Agent.
  const res = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { "User-Agent": "Geloof-je-dat-ook-app/1.0 (+podcastfeed-sync)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

// Probeert het aflevering­nummer te herleiden: eerst uit het itunes:episode-
// veld (als de feed dat meegeeft), anders uit een nummer vooraan de titel
// ("127: ...", "127 - ...", "Aflevering 127: ...", "#127 ..."). Vindt geen
// van beide een nummer, dan slaan we die aflevering over — beter dan een
// gok die per ongeluk een bestaande aflevering overschrijft.
function extractEpisodeNumber(item: FeedItem): number | null {
  const fromItunes = item["itunes:episode"]?.trim();
  if (fromItunes && /^\d+$/.test(fromItunes)) {
    return parseInt(fromItunes, 10);
  }

  const title = item.title ?? "";
  const patterns = [/^\s*(?:aflevering\s*)?#?(\d{1,5})\s*[:.\-–]/i, /^\s*#(\d{1,5})\b/];
  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) return parseInt(match[1], 10);
  }
  return null;
}

function extractSummary(item: FeedItem): string | null {
  const raw = item.contentSnippet ?? item["itunes:summary"] ?? item.summary ?? item.content ?? "";
  const cleaned = raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return cleaned || null;
}

/**
 * Haalt de podcastfeed op en zet elke aflevering die erin staat neer als
 * PodcastEpisode-rij (titel/omschrijving/link/publicatiedatum), zodat die
 * nooit met de hand overgetypt hoeven te worden. Raakt bewust nooit
 * PodcastExercise-rijen aan: de oefeningen per aflevering blijven handwerk
 * (zie prisma/podcastContent.ts + prisma/importPodcast.ts) en worden hier
 * niet aangemaakt of overschreven — een nieuwe aflevering verschijnt dus met
 * de juiste naam/omschrijving in de cursus, met "oefeningen volgen nog"
 * totdat die met de hand zijn toegevoegd.
 *
 * Faalt het ophalen van de feed (offline, onbereikbaar, onverwacht formaat),
 * dan loggen we een waarschuwing i.p.v. de hele content-import te laten
 * mislukken: dit is een aanvulling op db:seed, geen vereiste stap.
 */
export async function syncPodcastFeed(client: PrismaClient, log: (msg: string) => void = console.log): Promise<void> {
  let feed;
  try {
    const xml = await fetchFeedXml(FEED_URL);
    feed = await parser.parseString(xml);
  } catch (e) {
    log(`Podcastfeed ophalen mislukt (${FEED_URL}): ${e instanceof Error ? e.message : String(e)} — overgeslagen.`);
    return;
  }

  let created = 0;
  let updated = 0;
  for (const item of feed.items) {
    const number = extractEpisodeNumber(item);
    if (number === null) {
      log(`  Kon geen aflevering­nummer herleiden uit "${item.title ?? "(zonder titel)"}" — overgeslagen.`);
      continue;
    }

    const title = item.title?.trim() || `Aflevering ${number}`;
    const summary = extractSummary(item);
    const listenUrl = item.link ?? item.enclosure?.url ?? null;
    const isoDate = item.isoDate ?? item.pubDate;
    const publishedAt = isoDate && !Number.isNaN(Date.parse(isoDate)) ? new Date(isoDate) : null;

    const existing = await client.podcastEpisode.findUnique({ where: { number } });
    await client.podcastEpisode.upsert({
      where: { number },
      update: { title, summary, listenUrl, publishedAt, order: -number },
      create: { number, title, summary, listenUrl, publishedAt, order: -number },
    });
    if (existing) updated++;
    else created++;
  }

  log(`Podcastfeed gesynchroniseerd: ${created} nieuw, ${updated} bijgewerkt.`);
}
