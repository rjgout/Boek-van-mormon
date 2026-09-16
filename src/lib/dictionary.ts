import bomWordCounts from "../../prisma/bomWordCounts.json";
import { prisma } from "@/lib/db";

export interface DictionaryEntry {
  word: string;
  count: number;
}

// Zelfde brontekst en exact dezelfde extractie (regex + kleine letters +
// diakritische tekens strippen) als prisma/bomWords.json, zodat deze lijst
// altijd één-op-één overeenkomt met wat geldig is in het woordlegspel (zie
// src/lib/scrabble/dictionary.ts) — dit woordenboek is dus ook bruikbaar
// als hulpmiddel bij woordspelletjes. Statisch gegenereerd i.p.v. live
// opgeteld uit de database, om dezelfde reden dat bomWords.json dat ook is.
const ENTRIES: DictionaryEntry[] = Object.entries(bomWordCounts as Record<string, number>)
  .map(([word, count]) => ({ word, count }))
  .sort((a, b) => a.word.localeCompare(b.word, "nl"));

export function getDictionaryEntries(): DictionaryEntry[] {
  return ENTRIES;
}

export interface VerseMatch {
  bookName: string;
  chapterNumber: number;
  verseNumber: number;
  text: string;
}

// Haalt het diakriet-vrije woord terug in de brontekst: dezelfde extractie
// (regex + NFD-normaliseren + diakritische tekens strippen + kleine
// letters) als waarmee prisma/bomWords.json zelf is opgebouwd, zodat een
// woord uit die lijst hier gegarandeerd ook weer teruggevonden wordt —
// ongeacht hoofdletters aan het begin van een zin of eventuele accenten in
// de brontekst.
const COMBINING_DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");

function normalizeToken(s: string): string {
  return s.normalize("NFD").replace(COMBINING_DIACRITICS, "").toLowerCase();
}

/**
 * Alle verzen waar een bepaald woord (heel woord, geen deel van een langer
 * woord) in voorkomt — gebruikt door het Woordenboek (klik op een woord) en
 * door het dagelijkse woordspel (na afloop, om te laten zien waar het woord
 * van vandaag vandaan komt). Scant de volledige verzentabel (~6600 rijen,
 * dus prima snel genoeg voor deze niet-veelgevraagde actie) in plaats van
 * een aparte woord-naar-verzen-index bij te houden.
 */
export async function findVersesContainingWord(word: string): Promise<VerseMatch[]> {
  const target = normalizeToken(word);
  const verses = await prisma.verse.findMany({
    select: {
      number: true,
      text: true,
      chapter: { select: { number: true, book: { select: { name: true, order: true } } } },
    },
  });

  return verses
    .filter((v) => (v.text.match(/[A-Za-zÀ-ÿ]+/g) ?? []).some((token) => normalizeToken(token) === target))
    .sort((a, b) => a.chapter.book.order - b.chapter.book.order || a.chapter.number - b.chapter.number || a.number - b.number)
    .map((v) => ({
      bookName: v.chapter.book.name,
      chapterNumber: v.chapter.number,
      verseNumber: v.number,
      text: v.text,
    }));
}
