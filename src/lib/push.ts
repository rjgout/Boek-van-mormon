import webpush from "web-push";
import { prisma } from "@/lib/db";
import { decryptSecret, encryptSecret } from "@/lib/crypto";

/**
 * VAPID-sleutelpaar waarmee deze server zich bij pushdiensten (FCM/Mozilla/
 * ...) identificeert. Wordt bij het allereerste gebruik automatisch
 * gegenereerd en in PushSettings opgeslagen (net als EmailSettings een
 * singleton-rij) — geen admin-actie of losse env-var nodig, in
 * tegenstelling tot SMTP, waarvan de gegevens nu eenmaal niet te raden zijn.
 */
let cachedKeys: { publicKey: string; privateKey: string } | null = null;

async function getVapidKeys(): Promise<{ publicKey: string; privateKey: string }> {
  if (cachedKeys) return cachedKeys;

  const existing = await prisma.pushSettings.findUnique({ where: { id: "singleton" } });
  if (existing) {
    cachedKeys = { publicKey: existing.publicKey, privateKey: decryptSecret(existing.privateKey) };
    return cachedKeys;
  }

  const generated = webpush.generateVAPIDKeys();
  try {
    await prisma.pushSettings.create({
      data: {
        id: "singleton",
        publicKey: generated.publicKey,
        privateKey: encryptSecret(generated.privateKey),
      },
    });
  } catch {
    // Race: een andere request genereerde ondertussen ook al een sleutelpaar
    // en won de unieke-id-constraint — gebruik die in plaats van dubbel te
    // genereren (anders werken oude subscripties met de verkeerde public key).
    const row = await prisma.pushSettings.findUniqueOrThrow({ where: { id: "singleton" } });
    cachedKeys = { publicKey: row.publicKey, privateKey: decryptSecret(row.privateKey) };
    return cachedKeys;
  }

  cachedKeys = generated;
  return cachedKeys;
}

export async function getVapidPublicKey(): Promise<string> {
  return (await getVapidKeys()).publicKey;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

/**
 * Stuurt een pushnotificatie naar alle geregistreerde apparaten van een
 * gebruiker. Verwijdert automatisch subscripties die de pushdienst als
 * verlopen/ingetrokken meldt (404/410) — anders blijft de app tegen een dode
 * endpoint aan praten bij elke volgende notificatie.
 */
export async function sendPushToUser(userId: string, payload: PushPayload): Promise<void> {
  const subscriptions = await prisma.pushSubscription.findMany({ where: { userId } });
  if (subscriptions.length === 0) return;

  const { publicKey, privateKey } = await getVapidKeys();
  webpush.setVapidDetails(`mailto:noreply@localhost`, publicKey, privateKey);

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify({ title: payload.title, body: payload.body, url: payload.url ?? "/" })
        );
      } catch (e) {
        const statusCode = (e as { statusCode?: number })?.statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        }
      }
    })
  );
}
