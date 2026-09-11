import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

// Versleutelt geheimen (zoals het SMTP-wachtwoord in EmailSettings) at rest,
// met een sleutel afgeleid van SESSION_SECRET — geen apart secret nodig.
function getKey(): Buffer {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("SESSION_SECRET ontbreekt of is te kort.");
  }
  return createHash("sha256").update(secret).digest();
}

export function encryptSecret(plainText: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv, authTag, encrypted].map((b) => b.toString("base64")).join(".");
}

export function decryptSecret(encoded: string): string {
  const [ivB64, tagB64, dataB64] = encoded.split(".");
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");
  const data = Buffer.from(dataB64, "base64");
  const decipher = createDecipheriv("aes-256-gcm", getKey(), iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}
