import { prisma } from "@/lib/db";
import { sendMail } from "@/lib/email";
import { sendPushToUser } from "@/lib/push";
import { getAppUrl } from "@/lib/baseUrl";
import { APP_NAME } from "@/lib/brand";

interface NotifyInput {
  userId: string;
  subject: string;
  emailHtml: string;
  emailText: string;
  pushTitle: string;
  pushBody: string;
  url: string;
}

/**
 * Centrale dispatcher: stuurt alleen via de kanalen die deze gebruiker zelf
 * heeft aangezet (zie User.emailNotificationsEnabled/pushNotificationsEnabled
 * in schema.prisma — beide standaard uit). Faalt bewust stil per kanaal
 * (bv. e-mail niet geconfigureerd, of geen pushsubscripties) — een
 * notificatie is nooit kritiek voor de aanroepende flow (les afronden,
 * vriendschapsverzoek versturen, ...).
 */
async function notifyUser(input: NotifyInput): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: input.userId },
    select: { email: true, emailNotificationsEnabled: true, pushNotificationsEnabled: true },
  });
  if (!user) return;

  const jobs: Promise<unknown>[] = [];
  if (user.emailNotificationsEnabled) {
    jobs.push(sendMail({ to: user.email, subject: input.subject, html: input.emailHtml, text: input.emailText }));
  }
  if (user.pushNotificationsEnabled) {
    jobs.push(sendPushToUser(input.userId, { title: input.pushTitle, body: input.pushBody, url: input.url }));
  }
  await Promise.allSettled(jobs);
}

function emailWrap(bodyHtml: string, ctaUrl: string, ctaLabel: string): string {
  return `<p>${bodyHtml}</p><p><a href="${ctaUrl}">${ctaLabel} →</a></p><p style="color:#94a3b8;font-size:12px">${APP_NAME} — je kan e-mailnotificaties uitzetten in je profiel.</p>`;
}

export async function notifyFriendRequest(receiverUserId: string, senderDisplayName: string): Promise<void> {
  const url = `${getAppUrl()}/friends`;
  await notifyUser({
    userId: receiverUserId,
    subject: `${senderDisplayName} stuurde je een vriendschapsverzoek`,
    emailHtml: emailWrap(`<strong>${senderDisplayName}</strong> wil vrienden met je worden op ${APP_NAME}.`, url, "Bekijk verzoek"),
    emailText: `${senderDisplayName} wil vrienden met je worden op ${APP_NAME}. Bekijk het verzoek: ${url}`,
    pushTitle: "Nieuw vriendschapsverzoek",
    pushBody: `${senderDisplayName} wil vrienden met je worden.`,
    url: "/friends",
  });
}

export async function notifyAchievement(userId: string, achievementName: string, achievementIcon: string): Promise<void> {
  const url = `${getAppUrl()}/profile`;
  await notifyUser({
    userId,
    subject: `Nieuwe prestatie behaald: ${achievementName}`,
    emailHtml: emailWrap(`${achievementIcon} Je hebt de prestatie <strong>${achievementName}</strong> behaald!`, url, "Bekijk je profiel"),
    emailText: `${achievementIcon} Je hebt de prestatie "${achievementName}" behaald! Bekijk je profiel: ${url}`,
    pushTitle: "Nieuwe prestatie! " + achievementIcon,
    pushBody: `Je hebt "${achievementName}" behaald.`,
    url: "/profile",
  });
}

export async function notifyWeeklyResult(userId: string, outcome: "promoted" | "demoted" | "stayed", tierLabel: string): Promise<void> {
  const url = `${getAppUrl()}/competition`;
  const text =
    outcome === "promoted"
      ? `Gefeliciteerd! Je bent gepromoveerd naar de ${tierLabel}.`
      : outcome === "demoted"
        ? `Je bent deze week gedegradeerd naar de ${tierLabel}. Volgende week weer omhoog!`
        : `Je blijft deze week in de ${tierLabel}.`;
  await notifyUser({
    userId,
    subject: "Je wekelijkse competitie-uitslag",
    emailHtml: emailWrap(text, url, "Bekijk de competitie"),
    emailText: `${text} Bekijk de competitie: ${url}`,
    pushTitle: outcome === "promoted" ? "Gepromoveerd! 🎉" : outcome === "demoted" ? "Gedegradeerd" : "Competitie-uitslag",
    pushBody: text,
    url: "/competition",
  });
}

export async function notifyDailyReminder(userId: string): Promise<void> {
  const url = `${getAppUrl()}/dashboard`;
  await notifyUser({
    userId,
    subject: "Je hebt vandaag nog niet geoefend",
    emailHtml: emailWrap(`Je bent vandaag nog niet langs geweest bij ${APP_NAME} — hou je streak in leven!`, url, "Nu oefenen"),
    emailText: `Je bent vandaag nog niet langs geweest bij ${APP_NAME} — hou je streak in leven! Nu oefenen: ${url}`,
    pushTitle: "Vergeet je streak niet! 🔥",
    pushBody: "Je hebt vandaag nog niet geoefend.",
    url: "/dashboard",
  });
}

export async function notifyChallengeReceived(receiverUserId: string, senderDisplayName: string, bookName: string, chapterNumber: number): Promise<void> {
  const url = `${getAppUrl()}/challenges`;
  const text = `${senderDisplayName} daagt je uit op ${bookName} ${chapterNumber}!`;
  await notifyUser({
    userId: receiverUserId,
    subject: text,
    emailHtml: emailWrap(text, url, "Bekijk de uitdaging"),
    emailText: `${text} Bekijk de uitdaging: ${url}`,
    pushTitle: "Nieuwe uitdaging! ⚔️",
    pushBody: text,
    url: "/challenges",
  });
}

export async function notifyChallengeDeclined(senderUserId: string, receiverDisplayName: string): Promise<void> {
  const url = `${getAppUrl()}/challenges`;
  const text = `${receiverDisplayName} heeft je uitdaging geweigerd.`;
  await notifyUser({
    userId: senderUserId,
    subject: "Je uitdaging is geweigerd",
    emailHtml: emailWrap(text, url, "Bekijk uitdagingen"),
    emailText: `${text} ${url}`,
    pushTitle: "Uitdaging geweigerd",
    pushBody: text,
    url: "/challenges",
  });
}

export async function notifyChallengeYourTurn(userId: string, opponentDisplayName: string): Promise<void> {
  const url = `${getAppUrl()}/challenges`;
  const text = `${opponentDisplayName} heeft gespeeld — jij bent aan de beurt!`;
  await notifyUser({
    userId,
    subject: text,
    emailHtml: emailWrap(text, url, "Speel je beurt"),
    emailText: `${text} ${url}`,
    pushTitle: "Jij bent aan de beurt! ⚔️",
    pushBody: text,
    url: "/challenges",
  });
}

/** Zoekt de zojuist behaalde achievement-slugs (zie StudyResult.newAchievements) op en notificeert er per stuk over. */
export async function notifyNewAchievements(userId: string, slugs: string[]): Promise<void> {
  if (slugs.length === 0) return;
  const achievements = await prisma.achievement.findMany({ where: { slug: { in: slugs } } });
  await Promise.allSettled(achievements.map((a) => notifyAchievement(userId, a.name, a.icon)));
}

export async function notifyChallengeFinished(userId: string, opponentDisplayName: string, won: boolean, tied: boolean): Promise<void> {
  const url = `${getAppUrl()}/challenges`;
  const text = tied
    ? `Gelijkspel tegen ${opponentDisplayName}!`
    : won
      ? `Je hebt gewonnen van ${opponentDisplayName}! 🎉`
      : `Je hebt verloren van ${opponentDisplayName}.`;
  await notifyUser({
    userId,
    subject: `Uitdaging afgerond: ${text}`,
    emailHtml: emailWrap(text, url, "Bekijk het resultaat"),
    emailText: `${text} ${url}`,
    pushTitle: "Uitdaging afgerond",
    pushBody: text,
    url: "/challenges",
  });
}
