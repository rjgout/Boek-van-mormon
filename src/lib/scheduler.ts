import { prisma } from "@/lib/db";
import { dayKey, weekStartKey, amsterdamNow, type AmsterdamTime } from "@/lib/dates";
import { resolveStartingTier, TIER_ORDER } from "@/lib/leagues";
import { notifyDailyReminder, notifyWeeklyResult, notifyWordGame } from "@/lib/notify";
import { TIER_LABELS } from "@/lib/leagues";
import { wordGameDayKey } from "@/lib/wordGame";

const TICK_MS = 60_000;
// Vast (niet instelbaar) moment voor de wekelijkse uitslag — dit is geen
// per-gebruiker voorkeur zoals de dagelijkse herinnering, maar één
// systeemmoment vlak na het einde van de vorige week.
const WEEKLY_RESULT_TIME = "00:05";

// Beide ticks hieronder vergelijken tegen een door de gebruiker gekozen of
// vast Nederlands tijdstip (bv. "20:00"), dus moeten tegen de Nederlandse
// wandklok getoetst worden — niet tegen de tijdzone van de servermachine
// (die in productie gewoon UTC kan zijn), net als de woordspel-tick
// hieronder al deed.
function amsterdamHHMM(amsterdam: AmsterdamTime): string {
  return `${String(amsterdam.hour).padStart(2, "0")}:${String(amsterdam.minute).padStart(2, "0")}`;
}

/** Dag van de week (0 = zondag, 1 = maandag, ...) van een Nederlandse kalenderdatum. */
function amsterdamDayOfWeek(amsterdam: AmsterdamTime): number {
  return new Date(Date.UTC(amsterdam.year, amsterdam.month - 1, amsterdam.day)).getUTCDay();
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
  const time = amsterdamHHMM(amsterdamNow(now));
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
  const amsterdam = amsterdamNow(now);
  if (amsterdamDayOfWeek(amsterdam) !== 1 || amsterdamHHMM(amsterdam) !== WEEKLY_RESULT_TIME) return; // maandag, vast tijdstip (NL)

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

/**
 * Stuurt, precies om 18:00 Nederlandse tijd (het moment waarop het woord van
 * de dag wisselt, zie wordGameDayKey in src/lib/wordGame.ts), een melding
 * naar iedereen die dat aan heeft staan. lastWordGameNotifiedDate voorkomt
 * dubbel versturen, net als bij de dagelijkse herinnering hierboven — met
 * dagKey ipv HH:MM-vergelijking, want de wisseling zelf gebeurt al op een
 * vast tijdstip.
 */
async function runWordGameNotificationTick(): Promise<void> {
  const now = new Date();
  const amsterdam = amsterdamNow(now);
  if (amsterdam.hour !== 18 || amsterdam.minute !== 0) return;

  const today = wordGameDayKey(now);
  const candidates = await prisma.user.findMany({
    where: {
      OR: [{ emailNotificationsEnabled: true }, { pushNotificationsEnabled: true }],
      notifyWordGame: true,
      AND: [{ OR: [{ lastWordGameNotifiedDate: null }, { lastWordGameNotifiedDate: { not: today } }] }],
    },
    select: { id: true },
  });

  for (const user of candidates) {
    await notifyWordGame(user.id).catch(() => {});
    await prisma.user.update({ where: { id: user.id }, data: { lastWordGameNotifiedDate: today } }).catch(() => {});
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
    runWordGameNotificationTick().catch((e) => console.error("Woord-van-de-dag-melding mislukt:", e));
  }, TICK_MS);
}
