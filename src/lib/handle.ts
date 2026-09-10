// Puur data/format-logica, geen server-only imports — veilig voor zowel
// server (registratie/zoeken) als client (weergave) componenten.

export function generateDiscriminator(): string {
  const n = Math.floor(Math.random() * 100_000);
  return n.toString().padStart(5, "0");
}

export function formatTag(handle: string, discriminator: string): string {
  return `${handle}#${discriminator}`;
}

/** Herkent "Handle#12345"; geeft null terug als het formaat niet klopt. */
export function parseTag(input: string): { handle: string; discriminator: string } | null {
  const trimmed = input.trim();
  const hashIndex = trimmed.lastIndexOf("#");
  if (hashIndex === -1) return null;
  const handle = trimmed.slice(0, hashIndex).trim();
  const discriminator = trimmed.slice(hashIndex + 1).trim();
  if (!handle || !/^\d{1,5}$/.test(discriminator)) return null;
  return { handle, discriminator: discriminator.padStart(5, "0") };
}

export const HANDLE_REGEX = /^[\p{L}\p{N} _-]+$/u;
export const HANDLE_MIN_LENGTH = 2;
export const HANDLE_MAX_LENGTH = 24;
