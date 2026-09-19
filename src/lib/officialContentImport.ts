import { createHash } from "crypto";
import { prisma } from "@/lib/db";
import { amsterdamNow } from "@/lib/dates";

/**
 * Haalt automatisch de officiële Nederlandse jeugd-lesmaterialen van
 * churchofjesuschrist.org op ("Voor de kracht van de jeugd" en "Kom, Volg
 * Mij" voor jeugdwerk/zondagsschool) en slaat de ONGEWIJZIGDE brontekst op
 * in ImportedOfficialLesson — een losstaande staging-tabel, nog niet
 * gekoppeld aan enige bestaande content- of gebruikersfunctionaliteit.
 * Zie CLAUDE.md, sectie "Officiële content importeren" voor de volledige
 * achtergrond, en de opmerkingen hieronder bij elke aanname over de
 * URL-structuur — die zijn NIET geverifieerd tegen de live site (dit project
 * kan die vanuit de ontwikkelomgeving niet bereiken) en zijn bedoeld om bij
 * de eerste echte run in productie gecontroleerd te falen/gelogd te worden
 * i.p.v. stil de verkeerde dingen op te slaan.
 */

const BASE_URL = "https://www.churchofjesuschrist.org";
const LANG = "nld";
// Beleefd tegenover de bron: niet buiten proportie vaak verversen, en een
// duidelijk identificeerbare User-Agent i.p.v. een browser voor te wenden.
const FETCH_DELAY_MS = 500;
const USER_AGENT = "JehovaAppOfficialContentImporter/1.0 (+contentimport; leest alleen publieke lespagina's)";

export interface FetchResult {
  ok: boolean;
  status: number;
  html: string | null;
  error?: string;
}

async function fetchPage(url: string): Promise<FetchResult> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, "Accept-Language": "nl" },
      // Deze site staat weleens content pas na JS-navigatie te veranderen;
      // een gewone GET krijgt de server-gerenderde HTML, wat voor deze
      // (leesalleen, geen interactie) doeleinden voldoende moet zijn.
      redirect: "follow",
    });
    const html = await res.text();
    if (!res.ok) return { ok: false, status: res.status, html: null, error: `HTTP ${res.status}` };
    return { ok: true, status: res.status, html };
  } catch (e) {
    return { ok: false, status: 0, html: null, error: e instanceof Error ? e.message : "onbekende fout" };
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Beste-poging titelextractie: og:title, anders <title>, anders de URL zelf. */
function extractTitle(html: string, fallbackUrl: string): string {
  const og = /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i.exec(html);
  if (og?.[1]) return decodeHtmlEntities(og[1]).trim();
  const titleTag = /<title[^>]*>([^<]+)<\/title>/i.exec(html);
  if (titleTag?.[1]) return decodeHtmlEntities(titleTag[1]).trim();
  return fallbackUrl;
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'");
}

/** Zoekt alle href-waarden die aan een patroon voldoen, maakt er absolute, deduplicated URL's van (in volgorde van aantreffen). */
function extractMatchingLinks(html: string, hrefIncludes: string): string[] {
  const hrefRe = /href=["']([^"']+)["']/gi;
  const seen = new Set<string>();
  const result: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = hrefRe.exec(html)) !== null) {
    const href = decodeHtmlEntities(match[1]);
    if (!href.includes(hrefIncludes)) continue;
    const absolute = href.startsWith("http") ? href : new URL(href, BASE_URL).toString();
    // lang-param forceren/toevoegen zodat we altijd de Nederlandse versie pakken,
    // ook als de bron zelf een taalneutrale of andere-taal-link toont.
    const withLang = setLangParam(absolute, LANG);
    if (seen.has(withLang)) continue;
    seen.add(withLang);
    result.push(withLang);
  }
  return result;
}

function setLangParam(url: string, lang: string): string {
  const u = new URL(url);
  u.searchParams.set("lang", lang);
  return u.toString();
}

function sha256(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

interface DiscoveredLesson {
  url: string;
  year?: number;
  month?: number;
  sequenceInPeriod: number;
}

/**
 * "Voor de kracht van de jeugd" — maandelijkse jeugdlessen, gepubliceerd per
 * kalendermaand onder /study/ftsoy/{jaar}/{maand}/ met individuele lessen
 * (vastenzondag/tweede zondag/.../vijfde zondag) onder .../fsy-lessons/.
 * ONGEVERIFIEERDE aanname over het exacte pad — zie bestandstop.
 */
async function discoverFsyLessons(year: number, month: number): Promise<DiscoveredLesson[]> {
  const monthPadded = String(month).padStart(2, "0");
  const indexUrl = setLangParam(`${BASE_URL}/study/ftsoy/${year}/${monthPadded}/`, LANG);
  const page = await fetchPage(indexUrl);
  if (!page.ok || !page.html) return [];

  const links = extractMatchingLinks(page.html, "/fsy-lessons/");
  return links.map((url, i) => ({ url, year, month, sequenceInPeriod: i + 1 }));
}

/**
 * "Kom, Volg Mij" voor jeugdwerk/zondagsschool — ontdekt zelf welk
 * kalenderjaar/manual momenteel actueel is via de vaste landingspagina
 * (i.p.v. een jaartal in de code te hardcoden), en haalt vervolgens alle
 * daaronder gelinkte weekpagina's op. ONGEVERIFIEERD: welke exacte links op
 * de landingspagina naar "het huidige jeugdwerk/zondagsschool-manual" wijzen.
 */
async function discoverComeFollowMeWeeks(): Promise<DiscoveredLesson[]> {
  const landingUrl = setLangParam(`${BASE_URL}/study/come-follow-me`, LANG);
  const landing = await fetchPage(landingUrl);
  if (!landing.ok || !landing.html) return [];

  // Landingspagina linkt naar meerdere varianten (individueel/gezin, jeugdwerk
  // & zondagsschool, kinderen, enz.) — "for-home-and-church" is de variant die
  // ook in jeugdwerk/zondagsschool gebruikt wordt (zie manual-titel: "voor
  // thuis en in de kerk"). Eerste treffer = huidige jaar, want de kerk linkt
  // altijd naar het lopende jaar bovenaan.
  const manualLinks = extractMatchingLinks(landing.html, "/study/manual/come-follow-me-for-home-and-church-");
  const manualUrl = manualLinks[0];
  if (!manualUrl) return [];

  const manualPath = new URL(manualUrl).pathname; // bv. /study/manual/come-follow-me-for-home-and-church-old-testament-2026
  const yearMatch = /-(\d{4})$/.exec(manualPath);
  const year = yearMatch ? Number(yearMatch[1]) : undefined;

  const manual = await fetchPage(manualUrl);
  if (!manual.ok || !manual.html) return [];

  // Alle links die een sub-pagina van het manual zelf zijn (child-paden) —
  // bewust geen filter op "introductiepagina's" versus "echte weken": dat
  // onderscheid is zonder de echte HTML niet betrouwbaar te maken. Elke
  // gevonden sub-pagina wordt geïmporteerd; periodLabel bevat de eigen
  // koptekst van de bron, dus onderscheid blijft zichtbaar bij nader inzien.
  const weekLinks = extractMatchingLinks(manual.html, `${manualPath}/`);
  return weekLinks.map((url, i) => ({ url, year, sequenceInPeriod: i + 1 }));
}

async function upsertLesson(
  source: "FSY_YOUTH" | "COME_FOLLOW_ME_YOUTH",
  discovered: DiscoveredLesson
): Promise<"new" | "updated" | "unchanged" | "error"> {
  const page = await fetchPage(discovered.url);
  if (!page.ok || !page.html) {
    throw new Error(`${discovered.url}: ${page.error ?? `HTTP ${page.status}`}`);
  }

  const title = extractTitle(page.html, discovered.url);
  const contentHash = sha256(page.html);

  const existing = await prisma.importedOfficialLesson.findUnique({ where: { sourceUrl: discovered.url } });

  if (!existing) {
    await prisma.importedOfficialLesson.create({
      data: {
        source,
        sourceUrl: discovered.url,
        language: LANG,
        title,
        year: discovered.year ?? null,
        month: discovered.month ?? null,
        sequenceInPeriod: discovered.sequenceInPeriod,
        rawHtml: page.html,
        contentHash,
      },
    });
    return "new";
  }

  if (existing.contentHash === contentHash) {
    await prisma.importedOfficialLesson.update({
      where: { id: existing.id },
      data: { lastCheckedAt: new Date(), sequenceInPeriod: discovered.sequenceInPeriod },
    });
    return "unchanged";
  }

  await prisma.importedOfficialLesson.update({
    where: { id: existing.id },
    data: {
      title,
      rawHtml: page.html,
      contentHash,
      lastCheckedAt: new Date(),
      lastChangedAt: new Date(),
      sequenceInPeriod: discovered.sequenceInPeriod,
    },
  });
  return "updated";
}

export interface ImportRunSummary {
  id: string;
  urlsChecked: number;
  newCount: number;
  updatedCount: number;
  unchangedCount: number;
  errorCount: number;
  errors: { url: string; message: string }[];
}

/**
 * Voert één volledige importronde uit: ontdekt en verwerkt beide
 * contentbronnen, en legt het resultaat vast in OfficialContentImportRun.
 * Blijft draaien bij een fout op een individuele URL (gelogd, niet fataal) —
 * één kapotte pagina mag de rest van de run niet blokkeren.
 */
export async function runOfficialContentImport(triggeredBy: "scheduler" | "api"): Promise<ImportRunSummary> {
  const run = await prisma.officialContentImportRun.create({ data: { triggeredBy } });

  let newCount = 0;
  let updatedCount = 0;
  let unchangedCount = 0;
  const errors: { url: string; message: string }[] = [];

  const amsterdam = amsterdamNow();
  const discovered: { source: "FSY_YOUTH" | "COME_FOLLOW_ME_YOUTH"; items: DiscoveredLesson[] }[] = [];

  try {
    discovered.push({ source: "FSY_YOUTH", items: await discoverFsyLessons(amsterdam.year, amsterdam.month) });
  } catch (e) {
    errors.push({ url: "discover:fsy-youth", message: e instanceof Error ? e.message : "onbekende fout" });
  }

  await sleep(FETCH_DELAY_MS);

  try {
    discovered.push({ source: "COME_FOLLOW_ME_YOUTH", items: await discoverComeFollowMeWeeks() });
  } catch (e) {
    errors.push({ url: "discover:come-follow-me-youth", message: e instanceof Error ? e.message : "onbekende fout" });
  }

  for (const { source, items } of discovered) {
    for (const item of items) {
      try {
        const outcome = await upsertLesson(source, item);
        if (outcome === "new") newCount++;
        else if (outcome === "updated") updatedCount++;
        else if (outcome === "unchanged") unchangedCount++;
      } catch (e) {
        errors.push({ url: item.url, message: e instanceof Error ? e.message : "onbekende fout" });
      }
      await sleep(FETCH_DELAY_MS);
    }
  }

  const urlsChecked = discovered.reduce((sum, d) => sum + d.items.length, 0);

  await prisma.officialContentImportRun.update({
    where: { id: run.id },
    data: {
      finishedAt: new Date(),
      urlsChecked,
      newCount,
      updatedCount,
      unchangedCount,
      errorCount: errors.length,
      errors: errors.length > 0 ? JSON.stringify(errors) : null,
    },
  });

  return { id: run.id, urlsChecked, newCount, updatedCount, unchangedCount, errorCount: errors.length, errors };
}
