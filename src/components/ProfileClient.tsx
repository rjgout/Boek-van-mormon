"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LeagueTier } from "@prisma/client";
import { TIER_LABELS, TIER_ICONS } from "@/lib/leagues";
import { formatTag } from "@/lib/handle";
import { enableBrowserPush, disableBrowserPush, isPushSupported } from "@/lib/pushClient";
import ThemeToggle from "@/components/ThemeToggle";

interface AchievementView {
  slug: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string | null;
}

interface ProfileData {
  displayName: string;
  handle: string;
  discriminator: string;
  email: string;
  searchableByEmail: boolean;
  emailNotificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  dailyReminderTime: string;
  notifyDailyReminder: boolean;
  notifySocial: boolean;
  notifyAchievements: boolean;
  notifyWordGame: boolean;
  xpTotal: number;
  currentStreak: number;
  longestStreak: number;
  freezeCount: number;
  chaptersCompleted: number;
  chaptersStarted: number;
  duelsPlayed: number;
  duelsWon: number;
  tier: LeagueTier | null;
  achievements: AchievementView[];
}

export default function ProfileClient() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [savingPrivacy, setSavingPrivacy] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [pushError, setPushError] = useState<string | null>(null);
  const [testingPush, setTestingPush] = useState(false);
  const [pushTestMessage, setPushTestMessage] = useState<string | null>(null);
  const [editingHandle, setEditingHandle] = useState(false);
  const [handleInput, setHandleInput] = useState("");
  const [savingHandle, setSavingHandle] = useState(false);
  const [handleError, setHandleError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then(setData);
  }, []);

  async function toggleSearchableByEmail() {
    if (!data) return;
    const next = !data.searchableByEmail;
    setData({ ...data, searchableByEmail: next });
    setSavingPrivacy(true);
    await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ searchableByEmail: next }),
    }).catch(() => {});
    setSavingPrivacy(false);
  }

  async function saveAccountPatch(patch: Record<string, boolean | string>) {
    await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }).catch(() => {});
  }

  async function toggleEmailNotifications() {
    if (!data) return;
    const next = !data.emailNotificationsEnabled;
    setData({ ...data, emailNotificationsEnabled: next });
    setSavingNotifications(true);
    await saveAccountPatch({ emailNotificationsEnabled: next });
    setSavingNotifications(false);
  }

  async function togglePushNotifications() {
    if (!data) return;
    setPushError(null);
    const next = !data.pushNotificationsEnabled;
    setSavingNotifications(true);
    try {
      if (next) {
        await enableBrowserPush();
      } else {
        await disableBrowserPush();
      }
      setData({ ...data, pushNotificationsEnabled: next });
      await saveAccountPatch({ pushNotificationsEnabled: next });
    } catch (e) {
      setPushError(e instanceof Error ? e.message : "Kon pushnotificaties niet in-/uitschakelen.");
    }
    setSavingNotifications(false);
  }

  async function sendTestPush() {
    setTestingPush(true);
    setPushTestMessage(null);
    const res = await fetch("/api/push/test", { method: "POST" });
    const body = await res.json().catch(() => ({}));
    setTestingPush(false);
    setPushTestMessage(
      res.ok
        ? "Testmelding verstuurd — komt 'm niet aan? Wacht een minuutje en check of je telefoon niet in een stille/focus-modus staat."
        : (body.error ?? "Kon geen testmelding versturen.")
    );
  }

  async function changeReminderTime(time: string) {
    if (!data) return;
    setData({ ...data, dailyReminderTime: time });
    await saveAccountPatch({ dailyReminderTime: time });
  }

  async function toggleCategory(
    field: "notifyDailyReminder" | "notifySocial" | "notifyAchievements" | "notifyWordGame"
  ) {
    if (!data) return;
    const next = !data[field];
    setData({ ...data, [field]: next });
    setSavingNotifications(true);
    await saveAccountPatch({ [field]: next });
    setSavingNotifications(false);
  }

  function startEditingHandle() {
    if (!data) return;
    setHandleInput(data.handle);
    setHandleError(null);
    setEditingHandle(true);
  }

  async function saveHandle() {
    if (!data) return;
    setSavingHandle(true);
    setHandleError(null);
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handle: handleInput }),
    });
    const body = await res.json().catch(() => ({}));
    setSavingHandle(false);
    if (!res.ok) {
      setHandleError(body.error ?? "Kon de gebruikersnaam niet opslaan.");
      return;
    }
    // Het nummer erachter kies je niet zelf — het systeem behoudt je huidige
    // nummer waar mogelijk, of loot een nieuwe bij een botsing (zie
    // /api/account). Hier gewoon overnemen wat de server teruggeeft.
    setData({ ...data, handle: body.handle, discriminator: body.discriminator });
    setEditingHandle(false);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  async function deleteAccount() {
    setDeleting(true);
    const res = await fetch("/api/account", { method: "DELETE" });
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setDeleting(false);
    }
  }

  if (!data) return <p className="text-slate-400">Laden...</p>;

  const earnedCount = data.achievements.filter((a) => a.earnedAt).length;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      <Link href="/feedback" className="btn-secondary self-start">
        💬 Feedback geven
      </Link>

      <div className="card flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-extrabold text-brand-800 dark:text-brand-300">{data.displayName}</h1>
            <p className="text-slate-400 dark:text-slate-500">{formatTag(data.handle, data.discriminator)}</p>
          </div>
          {data.tier && (
            <span className="text-sm font-bold bg-brand-50 dark:bg-slate-700 text-brand-700 dark:text-brand-200 rounded-full px-3 py-1.5">
              {TIER_ICONS[data.tier]} {TIER_LABELS[data.tier]}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <Stat value={`🔥 ${data.currentStreak}`} label="Reeks" href="/streak" />
          <Stat value={`⭐ ${data.xpTotal}`} label="XP" />
          <Stat value={`🧊 ${data.freezeCount}`} label="Freezes" />
          <Stat value={`📖 ${data.chaptersCompleted}`} label="Hoofdstukken" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center text-sm text-slate-500 dark:text-slate-400">
          <Stat value={data.longestStreak.toString()} label="Langste reeks" small />
          <Stat value={`${data.duelsWon}/${data.duelsPlayed}`} label="Duels gewonnen" small />
          <Stat value={earnedCount.toString()} label="Achievements" small />
        </div>
      </div>

      <section>
        <h2 className="font-extrabold text-lg mb-3 dark:text-slate-100">Achievements</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data.achievements.map((a) => (
            <div
              key={a.slug}
              title={a.description}
              className={`card !p-4 flex flex-col items-center text-center gap-1 ${
                a.earnedAt ? "" : "opacity-40 grayscale"
              }`}
            >
              <span className="text-3xl">{a.icon}</span>
              <span className="text-xs font-bold dark:text-slate-200">{a.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card flex flex-col gap-3">
        <h2 className="font-extrabold text-lg dark:text-slate-100">Account</h2>

        <div className="flex items-center gap-3">
          <span className="text-sm dark:text-slate-200">Weergave (licht/donker)</span>
          <ThemeToggle />
        </div>

        {!editingHandle ? (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm dark:text-slate-200">
              Gebruikersnaam: <strong>{formatTag(data.handle, data.discriminator)}</strong>
            </span>
            <button className="btn-secondary !px-3 !py-1.5" onClick={startEditingHandle}>
              Wijzigen
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 flex-wrap">
              <input
                className="input !w-auto"
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                maxLength={24}
              />
              <span className="text-slate-400 dark:text-slate-500">#{data.discriminator}</span>
            </label>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Het nummer erachter kies je niet zelf — dat blijft door het systeem bepaald.
            </p>
            {handleError && <p className="text-sm text-red-600 dark:text-red-400">{handleError}</p>}
            <div className="flex gap-2">
              <button className="btn-primary !px-3 !py-1.5" disabled={savingHandle} onClick={saveHandle}>
                {savingHandle ? "Bezig..." : "Opslaan"}
              </button>
              <button className="btn-secondary !px-3 !py-1.5" onClick={() => setEditingHandle(false)}>
                Annuleren
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <Link href="/change-password" className="btn-secondary self-start">
            Wachtwoord wijzigen
          </Link>
          <button className="btn-secondary self-start" onClick={logout}>
            Uitloggen
          </button>
        </div>
      </section>

      <section className="card flex flex-col gap-3">
        <h2 className="font-extrabold text-lg dark:text-slate-100">Notificaties</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Voor: dagelijkse herinnering, vriendschapsverzoeken, prestaties, wekelijkse competitie-uitslag,
          uitdagingen en het woord van de dag. E-mail en push staan standaard allebei uit — zet aan wat je wil
          ontvangen, en kies hieronder voor welke soorten meldingen dat dan geldt.
        </p>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 accent-brand-500"
            checked={data.emailNotificationsEnabled}
            onChange={toggleEmailNotifications}
            disabled={savingNotifications}
          />
          <span className="text-sm dark:text-slate-200">E-mailnotificaties naar {data.email}</span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 accent-brand-500"
            checked={data.pushNotificationsEnabled}
            onChange={togglePushNotifications}
            disabled={savingNotifications || !isPushSupported()}
          />
          <span className="text-sm dark:text-slate-200">
            Pushnotificaties via de browser
            {!isPushSupported() && (
              <>
                <br />
                <span className="text-slate-400 dark:text-slate-500">Niet ondersteund in deze browser.</span>
              </>
            )}
          </span>
        </label>
        {pushError && <p className="text-sm text-red-600 dark:text-red-400">{pushError}</p>}

        {data.pushNotificationsEnabled && (
          <div className="flex flex-col gap-1 items-start">
            <button className="btn-secondary !px-3 !py-1.5" disabled={testingPush} onClick={sendTestPush}>
              {testingPush ? "Bezig..." : "Stuur testmelding"}
            </button>
            {pushTestMessage && <p className="text-xs text-slate-500 dark:text-slate-400">{pushTestMessage}</p>}
          </div>
        )}

        <label className="flex items-center gap-3">
          <span className="text-sm dark:text-slate-200">Dagelijkse herinnering rond</span>
          <input
            type="time"
            className="input !w-auto"
            value={data.dailyReminderTime}
            onChange={(e) => changeReminderTime(e.target.value)}
          />
        </label>

        <div className="border-t border-slate-100 dark:border-slate-700 pt-3 mt-1 flex flex-col gap-2">
          <p className="text-sm font-semibold dark:text-slate-200">Waarover wil je meldingen ontvangen?</p>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 accent-brand-500"
              checked={data.notifyDailyReminder}
              onChange={() => toggleCategory("notifyDailyReminder")}
              disabled={savingNotifications}
            />
            <span className="text-sm dark:text-slate-200">Dagelijkse herinnering om te oefenen</span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 accent-brand-500"
              checked={data.notifySocial}
              onChange={() => toggleCategory("notifySocial")}
              disabled={savingNotifications}
            />
            <span className="text-sm dark:text-slate-200">
              Sociaal — vriendschapsverzoeken, uitdagingen en woordspel-uitnodigingen
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 accent-brand-500"
              checked={data.notifyAchievements}
              onChange={() => toggleCategory("notifyAchievements")}
              disabled={savingNotifications}
            />
            <span className="text-sm dark:text-slate-200">Prestaties en wekelijkse competitie-uitslag</span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 accent-brand-500"
              checked={data.notifyWordGame}
              onChange={() => toggleCategory("notifyWordGame")}
              disabled={savingNotifications}
            />
            <span className="text-sm dark:text-slate-200">Woord van de dag — elke dag om 18:00 uur</span>
          </label>
        </div>
      </section>

      <section className="card flex flex-col gap-3">
        <h2 className="font-extrabold text-lg dark:text-slate-100">Privacy</h2>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 accent-brand-500"
            checked={data.searchableByEmail}
            onChange={toggleSearchableByEmail}
            disabled={savingPrivacy}
          />
          <span className="text-sm dark:text-slate-200">
            Vindbaar via e-mailadres ({data.email}) bij het toevoegen van vrienden.
            <br />
            <span className="text-slate-400 dark:text-slate-500">
              Staat standaard uit — je bent altijd vindbaar via je gebruikersnaam{" "}
              {formatTag(data.handle, data.discriminator)}, ongeacht deze instelling.
            </span>
          </span>
        </label>
      </section>

      <section className="card flex flex-col gap-3">
        <h2 className="font-extrabold text-lg dark:text-slate-100">Account</h2>
        {!confirmingDelete ? (
          <button className="btn-secondary self-start !text-red-500 !border-red-200" onClick={() => setConfirmingDelete(true)}>
            Account verwijderen
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-red-600 dark:text-red-400">
              Dit verwijdert je account en alle bijbehorende gegevens (voortgang, vrienden, quizresultaten)
              definitief. Dit kan niet ongedaan worden gemaakt.
            </p>
            <div className="flex gap-2">
              <button className="btn-primary !bg-red-500 !shadow-[0_4px_0_0_theme(colors.red.700)]" disabled={deleting} onClick={deleteAccount}>
                {deleting ? "Bezig..." : "Ja, definitief verwijderen"}
              </button>
              <button className="btn-secondary" onClick={() => setConfirmingDelete(false)}>
                Annuleren
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ value, label, small, href }: { value: string; label: string; small?: boolean; href?: string }) {
  const content = (
    <>
      <div className={small ? "font-extrabold dark:text-slate-100" : "text-xl font-extrabold dark:text-slate-100"}>{value}</div>
      <div className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase">{label}</div>
    </>
  );
  if (href) {
    return (
      <Link href={href} className="block hover:opacity-75">
        {content}
      </Link>
    );
  }
  return <div>{content}</div>;
}
