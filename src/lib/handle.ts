// Puur data/format-logica, geen server-only imports — veilig voor zowel
// server (registratie/zoeken) als client (weergave) componenten.

export function generateDiscriminator(): string {
  const n = Math.floor(Math.random() * 100);
  return n.toString().padStart(2, "0");
}

export function formatTag(handle: string, discriminator: string): string {
  return `${handle}#${discriminator}`;
}

/** Herkent "Handle#42"; geeft null terug als het formaat niet klopt. */
export function parseTag(input: string): { handle: string; discriminator: string } | null {
  const trimmed = input.trim();
  const hashIndex = trimmed.lastIndexOf("#");
  if (hashIndex === -1) return null;
  const handle = trimmed.slice(0, hashIndex).trim();
  const discriminator = trimmed.slice(hashIndex + 1).trim();
  if (!handle || !/^\d{1,2}$/.test(discriminator)) return null;
  return { handle, discriminator: discriminator.padStart(2, "0") };
}

// \p{Extended_Pictographic} dekt de gangbare emoji-set, \p{Emoji_Modifier}
// de huidskleur-varianten (Fitzpatrick), \p{Regional_Indicator} de letters
// waaruit vlagemoji zijn opgebouwd, en ‍/️ de onzichtbare
// samenvoeg-/presentatietekens die samengestelde emoji (bv. 👨‍👩‍👧) aan elkaar
// plakken.
export const HANDLE_REGEX = /^[\p{L}\p{N} _\-\p{Extended_Pictographic}\p{Emoji_Modifier}\p{Regional_Indicator}‍️]+$/u;
export const HANDLE_MIN_LENGTH = 2;
export const HANDLE_MAX_LENGTH = 24;

/**
 * Codepoint-bewuste "eerste teken" van een naam, voor gebruik in
 * avatar-rondjes — .charAt(0)/.slice(0, 1) knipt een emoji die uit een
 * surrogaatpaar bestaat (verreweg de meeste) doormidden, wat een kapot
 * teken oplevert i.p.v. de hele emoji.
 */
export function firstGrapheme(value: string): string {
  return Array.from(value.trim())[0] ?? "";
}

// De enige expliciet geweerde emoji in een gebruikersnaam. Optioneel gevolgd
// door een huidskleur-variant of de presentatie-variatieselector.
const FORBIDDEN_HANDLE_RE = /\u{1F595}[\u{1F3FB}-\u{1F3FF}\u{FE0F}]?/u;

/** True als de naam de geweerde middelvinger-emoji bevat (in elke huidskleur-variant). */
export function containsForbiddenEmoji(value: string): boolean {
  return FORBIDDEN_HANDLE_RE.test(value);
}

// Precies één emoji: een vlag (twee regionale-indicatorletters), of één
// pictogram met optionele huidskleur-variant/variatieselector, eventueel via
// ZWJ samengevoegd met meer pictogrammen (bv. 👨‍👩‍👧 of 🏳️‍🌈) — bewust ruimer dan
// firstGrapheme hierboven, want een avatar-emoji mag zo'n samengestelde emoji
// zijn, maar geen losse tekst/meerdere afzonderlijke emoji.
const SINGLE_EMOJI_RE =
  /^(?:\p{Regional_Indicator}\p{Regional_Indicator}|\p{Extended_Pictographic}️?\p{Emoji_Modifier}?(?:‍\p{Extended_Pictographic}️?)*)$/u;

/** True als de waarde (na trimmen) precies één emoji is — voor het avatar-emoji-veld. */
export function isSingleEmoji(value: string): boolean {
  return SINGLE_EMOJI_RE.test(value.trim());
}
