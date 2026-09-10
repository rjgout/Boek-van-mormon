// Genereert oefeningen uit brontekst. Bewust GEEN multiple choice: de gebruiker
// typt het ontbrekende woord zelf in, of legt woorden in de juiste volgorde.

const STOPWORDS = new Set([
  "de", "het", "een", "en", "van", "ik", "dat", "is", "in", "zijn", "op", "te",
  "met", "hij", "zij", "er", "om", "aan", "voor", "niet", "die", "dit", "dan",
  "wat", "we", "wij", "jij", "u", "maar", "of", "als", "dus", "ook", "naar",
  "uit", "bij", "zo", "nog", "toen", "want", "tot", "over", "onder", "zal",
  "zult", "zou", "zult", "had", "heeft", "hebben", "was", "waren", "wordt",
]);

export interface GeneratedExercise {
  type: "FILL_BLANK" | "WORD_BANK";
  verseRef: string;
  prompt: string;
  answers: string[];
  wordBank?: string[];
}

function cleanWord(raw: string): string {
  return raw.replace(/^[^a-zA-ZÀ-ÿ]+|[^a-zA-ZÀ-ÿ]+$/g, "");
}

function eligibleWords(text: string): { word: string; index: number }[] {
  const tokens = text.split(/\s+/);
  const eligible: { word: string; index: number }[] = [];
  tokens.forEach((token, index) => {
    const clean = cleanWord(token);
    if (clean.length >= 4 && !STOPWORDS.has(clean.toLowerCase())) {
      eligible.push({ word: clean, index });
    }
  });
  return eligible;
}

/** Kiest een woord uit de zin en vervangt het door een streepjeslijn. */
export function generateFillBlank(verseText: string, verseRef: string, seed = 0): GeneratedExercise | null {
  const candidates = eligibleWords(verseText);
  if (candidates.length === 0) return null;
  const pick = candidates[seed % candidates.length];
  const tokens = verseText.split(/\s+/);
  const target = tokens[pick.index];
  const answer = cleanWord(target);
  tokens[pick.index] = target.replace(answer, "____");
  return {
    type: "FILL_BLANK",
    verseRef,
    prompt: tokens.join(" "),
    answers: [answer.toLowerCase()],
  };
}

/** Haalt 3-4 opeenvolgende woorden weg; gebruiker moet ze in de juiste volgorde terugslepen. */
export function generateWordBank(verseText: string, verseRef: string, seed = 0): GeneratedExercise | null {
  const tokens = verseText.split(/\s+/).filter(Boolean);
  const spanLength = Math.min(4, Math.max(3, Math.floor(tokens.length / 4)));
  if (tokens.length < spanLength + 3) return null;

  const maxStart = tokens.length - spanLength;
  const start = 1 + (seed % Math.max(1, maxStart - 1));
  const span = tokens.slice(start, start + spanLength).map(cleanWord).filter(Boolean);
  if (span.length !== spanLength) return null;

  const before = tokens.slice(0, start).join(" ");
  const after = tokens.slice(start + spanLength).join(" ");
  const blankMarker = `[${span.map(() => "____").join(" ")}]`;
  const prompt = `${before} ${blankMarker} ${after}`.trim();

  const shuffled = [...span];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (seed * 31 + i * 17) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return {
    type: "WORD_BANK",
    verseRef,
    prompt,
    answers: span.map((w) => w.toLowerCase()),
    wordBank: shuffled,
  };
}

export function normalizeAnswer(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:"'()]/g, "");
}

export function isAnswerCorrect(given: string, accepted: string[]): boolean {
  const normalizedGiven = normalizeAnswer(given);
  return accepted.some((a) => normalizeAnswer(a) === normalizedGiven);
}

/** Voor WORD_BANK: de geplaatste woorden moeten in exact dezelfde volgorde staan. */
export function isWordBankCorrect(placedWords: string[], answers: string[]): boolean {
  if (placedWords.length !== answers.length) return false;
  return placedWords.every((w, i) => normalizeAnswer(w) === normalizeAnswer(answers[i]));
}
