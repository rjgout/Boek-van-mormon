import { prisma } from "@/lib/db";
import { dayKey, weekStartKey } from "@/lib/dates";
import { resolveStartingTier, TIER_ORDER } from "@/lib/leagues";
import { notifyDailyReminder, notifyWeeklyResult } from "@/lib/notify";
import { TIER_LABELS } from "@/lib/leagues";

const TICK_MS = 60_000;
// Vast (niet instelbaar) moment voor de wekelijkse uitslag — dit is geen
// per-gebruiker voorkeur zoals de dagelijkse herinnering, maar één
// systeemmoment vlak na het einde van de vorige week.
const WEEKLY_RESULT_TIME = "00:05";

function nowHHMM(d: Date): string {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function previousWeekStart(weekStart: string): string {
  const d = new Date(`${weekStart}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 7);
  return d.toISOString().slice(0, 10);
}

/**
 * Stuurt de dagelijkse "je hebt nog niet geoefend"-herinnering naar iedereen
 * wiens gekozen tijdstip (User.dailyReminderTime) samenvalt met de huidige
 * minuut, die vandaag nog niet heeft gestudeerd, en die minstens één kanaal
 * heeft aangezet. lastDailyReminderSentDate voorkomt dubbel versturen als de
 * tick door trage queries iets uitloopt.
 */
async function runDailyReminderTick(): Promise<void> {
  const now = new Date();
  const time = nowHHMM(now);
  const today = dayKey(now);

  const candidates = await prisma.user.findMany({
    where: {
      dailyReminderTime: time,
      OR: [{ emailNotificationsEnabled: true }, { pushNotificationsEnabled: true }],
      AND: [
        { OR: [{ lastStudyDate: null }, { lastStudyDate: { not: today } }] },
        { OR: [{ lastDailyReminderSentDate: null }, { lastDailyReminderSentDate: { not: today } }] },
      ],
    },
    select: { id: true },
  });

  for (const user of candidates) {
    await notifyDailyReminder(user.id).catch(() => {});
    await prisma.user.update({ where: { id: user.id }, data: { lastDailyReminderSentDate: today } }).catch(() => {});
  }
}

/**
 * Stuurt, één keer per week, de promotie/degradatie-uitslag van de zojuist
 * afgelopen week. Hergebruikt resolveStartingTier (dezelfde rangschikking
 * die ook "lazy" de starttier van de nieuwe week bepaalt) puur lezend, dus
 * zonder dat lopende hoofdstuk-flows moeten wachten op een wekelijkse
 * batchjob — die blijven de tier zelf lazy toepassen zoals voorheen.
 */
async function runWeeklyResultTick(): Promise<void> {
  const now = new Date();
  if (now.getDay() !== 1 || nowHHMM(now) !== WEEKLY_RESULT_TIME) return; // maandag, vast tijdstip

  const newWeek = weekStartKey(now);
  const endedWeek = previousWeekStart(newWeek);

  const endedScores = await prisma.weeklyScore.findMany({
    where: {
      weekStart: endedWeek,
      user: {
        OR: [{ emailNotificationsEnabled: true }, { pushNotificationsEnabled: true }],
        NOT: { lastWeeklyResultNotifiedWeek: endedWeek },
      },
    },
    select: { userId: true, tier: true },
  });

  for (const score of endedScores) {
    const newTier = await resolveStartingTier(prisma, score.userId, newWeek);
    const oldIdx = TIER_ORDER.indexOf(score.tier);
    const newIdx = TIER_ORDER.indexOf(newTier);
    const outcome = newIdx > oldIdx ? "promoted" : newIdx < oldIdx ? "demoted" : "stayed";

    await notifyWeeklyResult(score.userId, outcome, TIER_LABELS[newTier]).catch(() => {});
    await prisma.user
      .update({ where: { id: score.userId }, data: { lastWeeklyResultNotifiedWeek: endedWeek } })
      .catch(() => {});
  }
}

let started = false;

/** Start de in-process schedulers — bewust geen losse cron-infrastructuur (zie ook src/lib/leagues.ts). Eenmalig aan te roepen vanuit server.ts. */
export function startNotificationSchedulers(): void {
  if (started) return;
  started = true;
  setInterval(() => {
    runDailyReminderTick().catch((e) => console.error("Dagelijkse herinnering mislukt:", e));
    runWeeklyResultTick().catch((e) => console.error("Wekelijkse uitslag mislukt:", e));
  }, TICK_MS);
}
